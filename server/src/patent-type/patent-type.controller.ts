import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {CreatePatentTypeDto} from "./dto/patent-type.dto";
import {AuthGuard} from "@nestjs/passport";
import {PatentTypeService} from "./patent-type.service";

@Controller('patent-type')
export class PatentTypeController {

    constructor(private patentTypeService: PatentTypeService) {
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() dto: CreatePatentTypeDto) {
        return await this.patentTypeService.createPatentType(dto);
    }

    @Get('')
    async getAll() {
        return await this.patentTypeService.getAllPatentTypes();
    }
}
