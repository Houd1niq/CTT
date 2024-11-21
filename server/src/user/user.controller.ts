import {Controller, Get, UseGuards, Req} from "@nestjs/common";
import {UserService} from "./user.service";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {PayloadType} from "../auth/strategies";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {
  }

  @Get("info")
  @UseGuards(AuthGuard("jwt"))
  async get(@Req() req: Request) {
    const user = req.user as PayloadType;
    return await this.userService.getUserInfo(user.email);
  }
}
