import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { Request, Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { PayloadType } from "./strategies";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signin")
  @HttpCode(HttpStatus.CREATED)
  async signIn(@Body() dto: AuthDto, @Res() res: Response) {
    const tokens = await this.authService.signIn(dto);
    res.cookie("refresh-token", tokens.refresh_token, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });
    return res.send({ accessToken: tokens.access_token });
  }

  @UseGuards(AuthGuard("jwt"))
  @HttpCode(HttpStatus.OK)
  @Post("logout")
  async logout(@Req() req: Request, @Res() res: Response) {
    const user = req.user as PayloadType;
    res.clearCookie("refresh-token");
    await this.authService.logout(user.email);
    res.status(200);
    return res.send();
  }

  // @HttpCode(HttpStatus.OK)
  // @Post('reset-at')
  // async resetAt(@Req() req: Request, @Res() res: Response) {
  //   if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
  //     res.status(401);
  //     return res.send();
  //   }
  //   res.status(200);
  //   return res.send();
  // }

  @UseGuards(AuthGuard("jwt-refresh"))
  @HttpCode(HttpStatus.OK)
  @Get("refresh")
  async refresh(@Req() req: Request, @Res() res: Response) {
    const rt = req.cookies["refresh-token"];
    const user = req.user as PayloadType;
    const login = user.email;
    const id = user.id;
    const tokens = await this.authService.refresh(id, login, rt);
    res.cookie("refresh-token", tokens.refresh_token, {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    });
    return res.send({ accessToken: tokens.access_token });
  }
}
