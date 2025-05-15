import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {InstituteService} from "./institute.service";
import {CreateInstituteDto} from "./dto/institute.dto";

@Controller('institute')
export class InstituteController {
  constructor(private instituteService: InstituteService) {
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateInstituteDto) {
    return await this.instituteService.createInstitute(dto);
  }

  @Get('')
  async getAll() {
    return await this.instituteService.getAllInstitutes();
  }

  @Get('/deletable')
  @UseGuards(AuthGuard('jwt'))
  async getDeletable() {
    return await this.instituteService.getDeletableInstitutes();
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string) {
    return await this.instituteService.deleteInstitute(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async edit(@Param('id') id: string, @Body('name') name: string) {
    return await this.instituteService.editInstitute(id, name);
  }
} 