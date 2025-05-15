import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateInstituteDto} from "./dto/institute.dto";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class InstituteService {
  constructor(private prisma: PrismaService) {
  }

  async createInstitute(dto: CreateInstituteDto) {
    return this.prisma.institute.create({
      data: {
        name: dto.name
      }
    });
  }

  async getAllInstitutes() {
    return this.prisma.institute.findMany({
      select: {
        id: true,
        name: true
      }
    });
  }

  async getDeletableInstitutes() {
    //method checks if institute is connected to any patent and return list of institutes that can be deleted
    return this.prisma.institute.findMany({
      where: {
        Patent: {
          none: {}
        }
      }
    });
  }

  async deleteInstitute(id: string) {
    const isDeletable = await this.prisma.institute.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        Patent: true
      }
    });

    if (isDeletable.Patent.length === 0) {
      return this.prisma.institute.delete({
        where: {
          id: Number(id)
        }
      });
    } else {
      throw new BadRequestException('Институт используется в патентах, удаление невозможно');
    }
  }

  async editInstitute(id: string, name: string) {
    return this.prisma.institute.update({
      where: {
        id: Number(id)
      },
      data: {
        name
      }
    });
  }
} 