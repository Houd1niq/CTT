import {
    BadRequestException,
    Body,
    Controller, Delete,
    ForbiddenException, Get, Param,
    Post, Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {Request} from "express";
import {CreatePatentDto} from "./dto/patent.dto";
import {PatentService} from "./patent.service";
import {AuthGuard} from "@nestjs/passport";
import {PayloadType} from "../auth/strategies";
import {PatentFileInterceptor} from "./helpers/decorators";

@Controller("patent")
export class PatentController {
    constructor(private patentService: PatentService) {
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

        return await this.patentService.createPatent(dto);
    }

    @Get("")
    async getAll(
        @Query("page") page: string,
        @Query("sort") sort: string,
        @Query("technologyFieldId") technologyFieldId: string,
        @Query("patentTypeId") patentTypeId: string
    ) {
        return await this.patentService.getAllPatents(page, sort, technologyFieldId, patentTypeId)
    }

    @Get('search')
    async search(
        @Query('query') query: string
    ) {
        return await this.patentService.searchPatent(query)
    }

    @Delete(':patentNumber')
    @UseGuards(AuthGuard('jwt'))
    async delete(
        @Param('patentNumber') patentNumber: string
    ) {
        return await this.patentService.deletePatent(patentNumber)
    }
}