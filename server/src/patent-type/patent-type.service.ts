import {Injectable} from '@nestjs/common';
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
}
