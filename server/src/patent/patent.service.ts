import {BadRequestException, ForbiddenException, Injectable} from "@nestjs/common";
import {CreatePatentDto, EditPatentDto} from "./dto/patent.dto";
import {PrismaService} from "../prisma/prisma.service";
import {PatentSearchService} from "./patentSearch.service";
import {Patent} from "@prisma/client";
import {PdfService} from "../files/pdf.service";
import {join} from "path";
import {PayloadType} from "../auth/strategies";

@Injectable()
export class PatentService {
  private itemsPerPage = 10

  constructor(
    private prismaService: PrismaService,
    private patentSearchService: PatentSearchService,
    private pdfService: PdfService
  ) {
  }

  async createPatent(dto: CreatePatentDto, user: PayloadType) {
    //@ts-ignore
    dto.dateOfExpiration = new Date(dto.dateOfExpiration)
    //@ts-ignore
    dto.dateOfRegistration = new Date(dto.dateOfRegistration)

    let patent = undefined;
    let pdfContent = undefined;

    const userWithRole = await this.prismaService.user.findUnique({
      where: {id: user.id},
      include: {role: true},
    });
    if (!userWithRole) {
      throw new ForbiddenException('User not found');
    }

    if (userWithRole.role.name !== 'admin') {
      if (!dto.instituteId) {
        throw new ForbiddenException('Institute ID is required');
      }

      if (userWithRole.InstituteId !== Number(dto.instituteId)) {
        throw new ForbiddenException('You do not have access to this institute');
      }
    }

    try {
      // Extract PDF content if file is provided
      if (dto.patentFile) {
        pdfContent = await this.pdfService.extractTextFromPdfWithStructure(join(process.cwd(), 'uploads', dto.patentFile));
      }

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
          institute: {
            connect: {
              id: Number(dto.instituteId),
            }
          },
          technologyField: {
            connect: {
              id: Number(dto.technologyFieldId),
            },
          },
        }
      })
    } catch (e) {
      throw new BadRequestException('Ошибка при создании патента, скорее всего патент с таким номером уже существует')
    }

    await this.patentSearchService.indexPatent(dto, pdfContent)

    return patent
  }

  async searchPatent(query: string, sort: string, technologyFieldId: string, patentTypeId: string, instituteId: string) {
    const result = await this.patentSearchService.searchPatent(query)
    //@ts-ignore
    const patentNumbers: string[] = result.hits.map(hit => hit._source.patentNumber)

    const technologyFields = technologyFieldId ? technologyFieldId.split(',').map(Number) : undefined
    const patentTypeIds = patentTypeId ? patentTypeId.split(',').map(Number) : undefined
    const instituteIds = instituteId ? instituteId.split(',').map(Number) : undefined

    const patents = await this.prismaService.patent.findMany({
      orderBy: {
        dateOfRegistration: sort ? sort === 'asc' ? 'asc' : 'desc' : undefined
      },
      where: {
        patentNumber: {
          in: patentNumbers
        },
        technologyField: {
          id: {
            in: technologyFields
          }
        },
        patentType: {
          id: {
            in: patentTypeIds
          }
        },
        institute: {
          id: {
            in: instituteIds
          }
        }
      },
      include: {
        patentType: true,
        technologyField: true,
        institute: true
      },
    })

    this.normalizePatents(patents)
    return patents
  }

  async getAllPatents(page: string = '1', sort: string, technologyFieldId: string, patentTypeId: string, instituteId: string) {
    const technologyFields = technologyFieldId ? technologyFieldId.split(',').map(Number) : undefined
    const patentTypeIds = patentTypeId ? patentTypeId.split(',').map(Number) : undefined
    const instituteIds = instituteId ? instituteId.split(',').map(Number) : undefined

    const patents = await this.prismaService.patent.findMany({
      skip: (Number(page) - 1) * this.itemsPerPage,
      take: this.itemsPerPage,
      orderBy: {
        dateOfRegistration: sort ? sort === 'asc' ? 'asc' : 'desc' : undefined
      },
      where: {
        technologyField: {
          id: {
            in: technologyFields
          }
        },
        patentType: {
          id: {
            in: patentTypeIds
          }
        },
        institute: {
          id: {
            in: instituteIds
          }
        }
      },
      include: {
        patentType: true,
        technologyField: true,
        institute: true
      }
    })

    const total = await this.prismaService.patent.count({
      where: {
        technologyField: {
          id: {
            in: technologyFields
          }
        },
        patentType: {
          id: {
            in: patentTypeIds
          }
        },
        institute: {
          id: {
            in: instituteIds
          }
        }
      }
    })

    this.normalizePatents(patents)
    return {patents, totalPages: Math.ceil(total / this.itemsPerPage)}
  }

  normalizePatents(patents: Patent[]) {
    patents.forEach(p => {
      delete p.PatentTypeId
      delete p.TechnologyFieldId
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

  async editPatent(dto: EditPatentDto, patentId: string) {
    //@ts-ignore
    dto.dateOfExpiration = new Date(dto.dateOfExpiration.split('T')[0])
    //@ts-ignore
    dto.dateOfRegistration = new Date(dto.dateOfRegistration.split('T')[0])

    const {patentNumber} = await this.prismaService.patent.findUnique({
      where: {
        id: Number(patentId)
      },
      select: {
        patentNumber: true
      }
    })

    const patent = await this.prismaService.patent.update({
      where: {
        id: Number(patentId)
      },
      data: {
        name: dto.name,
        patentNumber: dto.patentNumber,
        dateOfRegistration: dto.dateOfRegistration,
        dateOfExpiration: dto.dateOfExpiration,
        contact: dto.contact,
        isPrivate: dto.isPrivate === 'true',
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
        institute: {
          connect: {
            id: Number(dto.instituteId),
          },
        },
      }
    })

    await this.patentSearchService.updatePatent(dto, patentNumber)

    return patent
  }
}


