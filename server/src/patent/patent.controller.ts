import {
  BadRequestException,
  Body,
  Controller, Delete,
  ForbiddenException, Get, Param,
  Post, Put, Query,
  Req, Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {Request, Response} from "express";
import {CreatePatentDto, EditPatentDto} from "./dto/patent.dto";
import {PatentService} from "./patent.service";
import {AuthGuard} from "@nestjs/passport";
import {PayloadType} from "../auth/strategies";
import {PatentFileInterceptor} from "./helpers/decorators";
import {EditPatentAccessGuard} from "./guards/patent-access.guard";
import {AdminGuard} from "../auth/guards/admin.guard";
import {PatentReportService} from "./patentReport.service";

@Controller("patent")
export class PatentController {
  constructor(private patentService: PatentService, private patentReportService: PatentReportService) {
  }

  @UseGuards(AuthGuard("jwt"), AdminGuard)
  @Get("report")
  async getPatentReport(@Req() req: Request, @Res() res: Response) {
    const buffer = await this.patentReportService.generatePatentReport();
    const date = new Date().toLocaleDateString()

    res.setHeader('Content-Disposition', 'attachment; filename=Patents_report.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("")
  @UseInterceptors(PatentFileInterceptor())
  async create(
    @Body() dto: CreatePatentDto,
    @UploadedFile() file: { filename: string },
    @Req() req: Request
  ) {
    const user = req.user as PayloadType;
    if (!user) {
      throw new ForbiddenException("Access denied");
    }
    if (!file) {
      throw new BadRequestException("Файл не загружен");
    }
    dto.patentFile = file.filename;

    return await this.patentService.createPatent(dto, user);
  }

  @UseGuards(AuthGuard("jwt"), EditPatentAccessGuard)
  @Put(":patentId")
  async edit(
    @Body() dto: EditPatentDto,
    @Param("patentId") patentId: string,
    @Req() req: Request
  ) {
    const user = req.user as PayloadType;
    if (!user) {
      throw new ForbiddenException("Access denied");
    }
    return await this.patentService.editPatent(dto, patentId);
  }

  @Get("")
  async getAll(
    @Query("page") page: string,
    @Query("sort") sort: string,
    @Query("technologyFieldId") technologyFieldId: string,
    @Query("patentTypeId") patentTypeId: string,
    @Query("instituteId") instituteId: string
  ) {
    return await this.patentService.getAllPatents(page, sort, technologyFieldId, patentTypeId, instituteId)
  }

  @Get('search')
  async search(
    @Query('query') query: string,
    @Query('sort') sort: string,
    @Query('technologyFieldId') technologyFieldId: string,
    @Query('patentTypeId') patentTypeId: string,
    @Query('instituteId') instituteId: string
  ) {
    return await this.patentService.searchPatent(query, sort, technologyFieldId, patentTypeId, instituteId)
  }

  @Delete(':patentNumber')
  @UseGuards(AuthGuard('jwt'), EditPatentAccessGuard)
  async delete(
    @Param('patentNumber') patentNumber: string
  ) {
    return await this.patentService.deletePatent(patentNumber)
  }
}
