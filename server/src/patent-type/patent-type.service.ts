import {BadRequestException, Injectable} from '@nestjs/common';
import {CreatePatentTypeDto} from "./dto/patent-type.dto";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class PatentTypeService {

  constructor(private prisma: PrismaService) {
  }

  async createPatentType(dto: CreatePatentTypeDto) {
    return this.prisma.patentType.create({
      data: {
        name: dto.name
      }
    });
  }

  async getAllPatentTypes() {
    return this.prisma.patentType.findMany({
        select: {
          id: true,
          name: true
        }
      }
    );
  }

  async getDeletablePatentTypes() {
    //method checks if patent type is connected to any patent and return list of patent types that can be deleted
    return this.prisma.patentType.findMany({
      where: {
        Patent: {
          none: {}
        }
      }
    })
  }

  async deletePatentType(id: string) {
    const isDeletable = await this.prisma.patentType.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        Patent: true
      }
    })

    if (isDeletable.Patent.length === 0) {
      return this.prisma.patentType.delete({
        where: {
          id: Number(id)
        }
      })
    } else {
      throw new BadRequestException('Тип патента используется в патентах, удаление невозможно');
    }
  }

  async editPatentType(id: string, name: string) {
    return this.prisma.patentType.update({
      where: {
        id: Number(id)
      },
      data: {
        name
      }
    })
  }
}
