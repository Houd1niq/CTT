import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {CreateTechnologyFieldDto} from "./dto/technology-field.dto";

@Injectable()
export class TechnologyFieldService {
    constructor(
        private prisma: PrismaService
    ) {
    }

    async createTechnologyField(dto: CreateTechnologyFieldDto) {
        return this.prisma.technologyField.create({
            data: {
                name: dto.name
            }
        });
    }

    async getAllTechnologyFields() {
        return this.prisma.technologyField.findMany(
            {
                select: {
                    id: true,
                    name: true
                }
            }
        );
    }

    async getDeletableTechnologyFields() {
        //method checks if technology field is connected to any patent and return list of technology fields that can be deleted
        return this.prisma.technologyField.findMany({
            where: {
                Patent: {
                    none: {}
                }
            }
        })
    }
}
