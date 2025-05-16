import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {TechnologyFieldService} from "./technology-field.service";
import {AuthGuard} from "@nestjs/passport";
import {CreateTechnologyFieldDto} from "./dto/technology-field.dto";
import {AdminGuard} from 'src/auth/guards/admin.guard';

@Controller('technology-field')
export class TechnologyFieldController {
  constructor(
    private technologyFieldService: TechnologyFieldService
  ) {
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async create(@Body() dto: CreateTechnologyFieldDto) {
    return await this.technologyFieldService.createTechnologyField(dto);
  }

  @Get('')
  async getAll() {
    return await this.technologyFieldService.getAllTechnologyFields();
  }

  @Get('deletable')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async getDeletable() {
    return await this.technologyFieldService.getDeletableTechnologyFields();
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async delete(@Param('id') id: string) {
    return await this.technologyFieldService.deleteTechnologyField(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async edit(@Param('id') id: string, @Body('name') name: string) {
    return await this.technologyFieldService.editTechnologyField(id, name);
  }
}
