import {Injectable} from '@nestjs/common';
import {ElasticsearchService} from '@nestjs/elasticsearch';
import {CreatePatentDto, EditPatentDto} from "./dto/patent.dto";

interface PatentSearchBody {
  patentNumber: string;
  name: string;
}

@Injectable()
export class PatentSearchService {
  index = 'patents'

  constructor(private readonly elasticsearchService: ElasticsearchService) {
  }

  async deletePatent(patentNumber: string) {
    return this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            patentNumber: patentNumber
          }
        }
      }
    })
  }

  async updatePatent(patent: EditPatentDto, originalPatentNumber: string) {
    await this.deletePatent(originalPatentNumber)
    return this.indexPatent(patent)
  }

  async indexPatent(patent: CreatePatentDto | EditPatentDto) {
    return this.elasticsearchService.index<PatentSearchBody>({
      index: this.index,
      body: {
        patentNumber: patent.patentNumber,
        name: patent.name,
      }
    })
  }

  async searchPatent(query: string) {
    query = query.toLowerCase()

    const {hits} = await this.elasticsearchService.search({
      index: this.index,
      body: {
        size: 1000,
        query: {
          bool: {
            should: [
              {
                term: {
                  patentNumber: query
                }
              },
              {
                "match": {
                  "name": {
                    "query": query,
                    "fuzziness": "AUTO",       // Автоматическая обработка опечаток
                    "operator": "and",         // Учитывать все слова из запроса
                    "prefix_length": 2,        // Минимальное совпадение начальных символов перед применением fuzziness
                    "max_expansions": 50       // Ограничение на количество проверяемых вариантов
                  }
                }
              },
              {
                wildcard: {
                  name: {
                    value: "*" + query + "*",
                    boost: 0.5,
                    rewrite: "constant_score",
                  }
                }
              },
            ]
          }
        }
      }
    })
    return hits
  }
}
