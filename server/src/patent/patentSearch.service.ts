import {Injectable} from '@nestjs/common';
import {ElasticsearchService} from '@nestjs/elasticsearch';
import {CreatePatentDto, EditPatentDto} from "./dto/patent.dto";
import {TEST_INDICES} from "../test/const";

interface PatentSearchBody {
  patentNumber: string;
  name: string;
  pdfContent?: string;
}

interface SearchResult {
  _id: string;
  _score: number;
  _source: PatentSearchBody;
}

interface SearchResponse {
  total: number;
  hits: SearchResult[];
}

interface SearchOptions {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class PatentSearchService {
  private readonly index = 'patentsv1';
  private readonly newIndex = process.env.NODE_ENV === 'test' ? TEST_INDICES.PATENTS : 'patentsv2';
  private readonly defaultPageSize = 20;
  private readonly maxPageSize = 100;

  constructor(private readonly elasticsearchService: ElasticsearchService) {
    process.env.NODE_ENV !== 'test' && this.initializeIndex();
  }

  private async initializeIndex() {
    try {
      const newIndexExists = await this.elasticsearchService.indices.exists({
        index: this.newIndex
      });

      if (!newIndexExists) {
        const indexBody = {
          mappings: {
            properties: {
              patentNumber: {type: 'keyword'},
              name: {type: 'text', analyzer: 'russian'},
              pdfContent: {type: 'text', analyzer: 'russian'}
            }
          }
        } as const;

        console.log('Creating index with body:', JSON.stringify(indexBody, null, 2));

        await this.elasticsearchService.indices.create({
          index: this.newIndex,
          body: indexBody
        });

        const oldIndexExists = await this.elasticsearchService.indices.exists({
          index: this.index
        })

        console.log('oldIndexExists', oldIndexExists)

        if (oldIndexExists) {
          await this.migrateData();
        }
      }
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to initialize Elasticsearch index: ${error.message}`);
    }
  }

  private async migrateData() {
    try {
      // Получаем все документы из старого индекса
      const response = await this.elasticsearchService.search<PatentSearchBody>({
        index: this.index,
        size: 10000,
        body: {
          query: {
            match_all: {}
          }
        }
      });

      // Создаем bulk запрос для переноса только существующих полей
      const bulkBody = response.hits.hits.flatMap(hit => [
        {index: {_index: this.newIndex, _id: hit._id}},
        {
          patentNumber: hit._source.patentNumber,
          name: hit._source.name
        }
      ]);

      console.log(bulkBody)

      if (bulkBody.length > 0) {
        await this.elasticsearchService.bulk({
          refresh: true,
          body: bulkBody
        });
      }
    } catch (error) {
      throw new Error(`Failed to migrate data: ${error.message}`);
    }
  }

  // Обновляем все методы для работы с новым индексом
  async deletePatent(patentNumber: string): Promise<void> {
    try {
      await this.elasticsearchService.deleteByQuery({
        index: this.newIndex,
        body: {
          query: {
            match: {
              patentNumber: patentNumber
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`Failed to delete patent: ${error.message}`);
    }
  }

  async updatePatent(patent: EditPatentDto, originalPatentNumber: string): Promise<void> {
    try {
      await this.deletePatent(originalPatentNumber);
      await this.indexPatent(patent);
    } catch (error) {
      throw new Error(`Failed to update patent: ${error.message}`);
    }
  }

  async indexPatent(patent: CreatePatentDto | EditPatentDto, pdfContent?: string): Promise<void> {
    try {
      await this.elasticsearchService.index<PatentSearchBody>({
        index: this.newIndex,
        body: {
          patentNumber: patent.patentNumber,
          name: patent.name,
          pdfContent: pdfContent
        }
      });
    } catch (error) {
      throw new Error(`Failed to index patent: ${error.message}`);
    }
  }

  async searchPatent(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    if (!query || typeof query !== 'string') {
      throw new Error('Invalid search query');
    }

    const page = Math.max(1, options.page || 1);
    const limit = Math.min(this.maxPageSize, options.limit || this.defaultPageSize);
    const from = (page - 1) * limit;

    try {
      const response = await this.elasticsearchService.search<PatentSearchBody>({
        index: this.newIndex,
        from,
        size: limit,
        body: {
          query: {
            bool: {
              should: [
                {
                  term: {
                    patentNumber: {
                      value: query,
                      boost: 3.0  // Больший вес для точного совпадения номера
                    }
                  }
                },
                {
                  wildcard: {
                    patentNumber: {
                      value: `*${query}*`,
                      boost: 2.0  // Средний вес для частичного совпадения номера
                    }
                  }
                },
                {
                  match: {name: {query, fuzziness: 'AUTO'}}
                },
                {
                  match: {pdfContent: {query, fuzziness: 'AUTO'}}
                },
              ],
              minimum_should_match: 1
            }
          },
          sort: options.sortField ? [
            {[options.sortField]: {order: options.sortOrder || 'desc'}}
          ] : [
            {_score: {order: 'desc'}}  // Сортировка по релевантности по умолчанию
          ]
        }
      });

      const total = typeof response.hits.total === 'number'
        ? response.hits.total
        : response.hits.total.value;

      return {
        total,
        hits: response.hits.hits.map(hit => ({
          _id: hit._id,
          _score: hit._score,
          _source: hit._source as PatentSearchBody
        }))
      };
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }
}
