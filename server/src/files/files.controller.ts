import {Controller, Get, Param, Req, Res, Headers, UnauthorizedException, BadRequestException} from '@nestjs/common';
import {Response} from 'express';
import {join} from 'path';
import {JwtService} from "@nestjs/jwt";
import {PrismaService} from "../prisma/prisma.service";

@Controller('files')
export class FilesController {
    constructor(
        private jwtService: JwtService,
        private prismaService: PrismaService) {
    }

    @Get(':filename')
    // @UseGuards(AuthGuard("jwt"))
    async serveFile(@Param('filename') filename: string, @Res() res: Response, @Req() req: Request, @Headers() headers: any) {
        const token = headers?.authorization?.split(' ')[1];

        const patent = await this.prismaService.patent.findUnique({
            where: {
                patentLink: filename
            }
        })
        if (!patent) {
            throw new BadRequestException('No such file');
        }
        if (patent.isPrivate) {
            try {
                this.jwtService.verify(token, {
                    secret: process.env.AT_SECRET,
                })
            } catch
                (e) {
                throw new UnauthorizedException()
            }
        }

        const filePath = join(process.cwd(), 'uploads', filename);  // Путь к папке с файлами
        res.sendFile(filePath);
    }
}
