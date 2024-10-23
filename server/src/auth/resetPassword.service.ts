import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
// import { RevokedTokensService } from "./revokedTokens.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService // private jwtService: JwtService // private revokedTokensService: RevokedTokensService
  ) {}

  async generateResetToken(email: string) {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    this.prisma.admin.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 600000),
      },
    });
  }

  async checkResetToken(email: string, token: string) {
    const user = await this.prisma.admin.findUnique({
      where: { email },
    });
    if (
      !user ||
      user.resetToken !== token ||
      user.resetTokenExpiry < new Date()
    ) {
      await this.prisma.admin.update({
        where: { email },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      });
      return false;
    }
    return true;
  }

  async resetPassword(email: string, password: string, token: string) {
    const user = await this.prisma.admin.findUnique({
      where: { email },
    });
    if (
      !user ||
      user.resetToken !== token ||
      user.resetTokenExpiry < new Date()
    ) {
      await this.prisma.admin.update({
        where: { email },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      });
      return false;
    }

    const hash = await bcrypt.hash(password, 10);
    await this.prisma.admin.update({
      where: { email },
      data: {
        hash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    return true;
  }
}
