import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Request, Response } from "express";
import { CreatePatentDto } from "./dto/patent.dto";
import { PatentService } from "./patent.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { AuthGuard } from "@nestjs/passport";
import { PayloadType } from "../auth/strategies";

@Controller("patent")
export class PatentController {
  constructor(private patentService: PatentService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
          cb(null, true);
        } else {
          cb(new Error("Только в формате PDF"), false);
        }
      },
    })
  )
  async create(
    @Body() dto: CreatePatentDto,
    @Res() res: Response,
    @UploadedFile() file: any,
    @Req() req: Request
  ) {
    const user = req.user as PayloadType;
    if (!user) {
      throw new ForbiddenException("Access denied");
    }
    console.log(file);
    // return await this.patentService.createPatent(dto);
  }
}
