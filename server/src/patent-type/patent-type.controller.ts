import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
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

  @Get('/deletable')
  @UseGuards(AuthGuard('jwt'))
  async getDeletable() {
    return await this.patentTypeService.getDeletablePatentTypes();
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string) {
    return await this.patentTypeService.deletePatentType(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async edit(@Param('id') id: string, @Body('name') name: string) {
    return await this.patentTypeService.editPatentType(id, name);
  }
}
