import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import * as bcrypt from "bcryptjs";
// import { JwtService } from "@nestjs/jwt";
import {EmailService} from "../email/email.service";

// import { RevokedTokensService } from "./revokedTokens.service";

@Injectable()
export class ResetPasswordService {
  constructor(
    private prisma: PrismaService, private emailService: EmailService
  ) {
  }

  async generateResetToken(email: string) {
    const token = String(Math.floor(100000 + Math.random() * 900000));
    const res = await this.prisma.user.update({
      where: {email},
      data: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 600000),
      },
    });
    await this.emailService.sendConfirmationCode(email, token)
    return res
  }

  async checkResetToken(email: string, token: string) {
    const user = await this.prisma.user.findUnique({
      where: {email},
    });
    if (
      !user ||
      user.resetToken !== token
    ) {
      if (user.resetTokenExpiry < new Date()) {
        await this.prisma.user.update({
          where: {email},
          data: {
            resetToken: null,
            resetTokenExpiry: null,
          },
        })
      }
      return false;
    }
    return true;
  }

  async resetPassword(email: string, password: string, token: string) {
    const user = await this.prisma.user.findUnique({
      where: {email},
    });
    if (
      !user ||
      user.resetToken !== token
    ) {
      if (user.resetTokenExpiry < new Date()) {
        await this.prisma.user.update({
          where: {email},
          data: {
            resetToken: null,
            resetTokenExpiry: null,
          },
        });
      }
      return false;
    }

    const hash = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: {email},
      data: {
        hash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    return true;
  }
}
