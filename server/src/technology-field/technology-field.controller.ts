import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {TechnologyFieldService} from "./technology-field.service";
import {AuthGuard} from "@nestjs/passport";
import {CreateTechnologyFieldDto} from "./dto/technology-field.dto";

@Controller('technology-field')
export class TechnologyFieldController {
    constructor(
        private technologyFieldService: TechnologyFieldService
    ) {
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Body() dto: CreateTechnologyFieldDto) {
        return await this.technologyFieldService.createTechnologyField(dto);
    }

    @Get('')
    async getAll() {
        return await this.technologyFieldService.getAllTechnologyFields();
    }

    @Get('deletable')
    @UseGuards(AuthGuard('jwt'))
    async getDeletable() {
        return await this.technologyFieldService.getDeletableTechnologyFields();
    }
}
