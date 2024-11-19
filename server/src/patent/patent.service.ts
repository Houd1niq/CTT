import {BadRequestException, Injectable} from "@nestjs/common";
import {CreatePatentDto} from "./dto/patent.dto";
import {PrismaService} from "../prisma/prisma.service";
import {PatentSearchService} from "./patentSearch.service";
import {Patent} from "@prisma/client";

@Injectable()
export class PatentService {
    private itemsPerPage = 10

    constructor(private prismaService: PrismaService, private patentSearchService: PatentSearchService) {
    }

    async createPatent(dto: CreatePatentDto) {
        // console.log(dto.dateOfExpiration, new Date(dto.dateOfExpiration))
        // dateOfExpiration: '20.03.2033' -> dateOfExpiration: '2033-03-20T00:00:00.000Z'
        dto.dateOfExpiration = dto.dateOfExpiration.split('.').reverse().join('-')
        dto.dateOfRegistration = dto.dateOfRegistration.split('.').reverse().join('-')
        dto.dateOfExpiration = new Date(dto.dateOfExpiration).toISOString()
        dto.dateOfRegistration = new Date(dto.dateOfRegistration).toISOString()
        let patent = undefined;
        try {
            patent = await this.prismaService.patent.create({
                data: {
                    name: dto.name,
                    patentNumber: dto.patentNumber,
                    dateOfRegistration: dto.dateOfRegistration,
                    dateOfExpiration: dto.dateOfExpiration,
                    contact: dto.contact,
                    isPrivate: dto.isPrivate === 'true',
                    patentLink: dto.patentFile,
                    patentType: {
                        connect: {
                            id: Number(dto.patentTypeId),
                        },
                    },
                    technologyField: {
                        connect: {
                            id: Number(dto.technologyFieldId),
                        },
                    },
                }
            })
        } catch (e) {
            console.log(e)
            throw new BadRequestException('Ошибка при создании патента, скорее всего патент с таким номером уже существует')
        }
        await this.patentSearchService.indexPatent(dto)

        return patent
    }

    async searchPatent(query: string) {
        const result = await this.patentSearchService.searchPatent(query)
        //@ts-ignore
        const patentNumbers = result.hits.map(hit => hit._source.patentNumber)
        const patents = await this.prismaService.patent.findMany({
            where: {
                patentNumber: {
                    in: patentNumbers
                }
            },
            include: {
                patentType: true,
                technologyField: true
            },
        })

        this.normalizePatents(patents)
        return patents
    }

    async getAllPatents(page: string = '1', sort: string, technologyFieldId: string, patentTypeId: string) {
        const patents = await this.prismaService.patent.findMany({
            skip: (Number(page) - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
            orderBy: {
                dateOfRegistration: sort === 'asc' ? 'asc' : 'desc'
            },
            where: {
                technologyField: {
                    id: technologyFieldId ? Number(technologyFieldId) : undefined
                },
                patentType: {
                    id: patentTypeId ? Number(patentTypeId) : undefined
                }
            },
            include: {
                patentType: true,
                technologyField: true
            }
        })

        this.normalizePatents(patents)
        return patents
    }

    normalizePatents(patents: Patent[]) {
        patents.forEach(p => {
            // delete p.PatentTypeId
            // delete p.TechnologyFieldId
            p.isPrivate && delete p.patentLink
        })
    }

    async deletePatent(patentNumber: string) {
        await this.patentSearchService.deletePatent(patentNumber)
        return this.prismaService.patent.delete({
            where: {
                patentNumber
            }
        });
    }
}


