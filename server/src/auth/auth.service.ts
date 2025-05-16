import {ForbiddenException, Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {AuthConfirmDto, AuthDto} from "./dto";
import * as bcrypt from "bcryptjs";
import {TokenTypes} from "./types";
import {JwtService} from "@nestjs/jwt";
import * as process from "process";
import {EmailService} from "../email/email.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService
  ) {
  }

  async signIn(dto: AuthDto) {
    const candidate = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!candidate) {
      throw new ForbiddenException("Неверный логин или пароль");
    }
    const compare = await bcrypt.compare(dto.password, candidate.hash);
    if (!compare) throw new ForbiddenException("Неверный логин или пароль");

    const token = String(Math.floor(100000 + Math.random() * 900000));
    await this.prisma.user.update({
      where: {email: dto.email},
      data: {
        authConfirmToken: token,
        authConfirmTokenExpiry: new Date(Date.now() + 600000),
      },
    });

    await this.emailService.sendAuthConfirmationCode(dto.email, token)

    return true
  }

  async confirm(dto: AuthConfirmDto) {
    const {email, code} = dto
    const user = await this.prisma.user.findUnique({
      where: {email},
    });

    if (!user || user.authConfirmToken !== code) {
      throw new ForbiddenException("Неверный код подтверждения");
    }

    if (user.authConfirmTokenExpiry < new Date()) {
      await this.prisma.user.update({
        where: {email},
        data: {
          authConfirmToken: null,
          authConfirmTokenExpiry: null,
        },
      })
      throw new ForbiddenException("Код подтверждения истек");
    }

    await this.prisma.user.update({
      where: {email},
      data: {
        authConfirmToken: null,
        authConfirmTokenExpiry: null,
      },
    })

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateHashRtInDB(user.email, tokens.refresh_token);
    return tokens;
  }


  async logout(email: string) {
    await this.prisma.user.update({
      where: {email},
      data: {
        hashedRt: null,
      },
    });
  }

  async refresh(id: number, email: string, rt: string) {
    const candidate = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!candidate || !candidate.hashedRt) {
      throw new ForbiddenException("Access denied");
    }
    const comparedRt = await bcrypt.compare(rt, candidate.hashedRt);
    if (!comparedRt) throw new ForbiddenException("Access denied");
    const tokens = await this.getTokens(id, email);
    await this.updateHashRtInDB(email, tokens.refresh_token);
    return tokens;
  }

  async updateHashRtInDB(email: string, rt: string) {
    const hash = await this.hashData(rt);
    await this.prisma.user.update({
      where: {email},
      data: {hashedRt: hash},
    });
  }

  async getTokens(id: number, email: string): Promise<TokenTypes> {
    const [rt, at] = await Promise.all([
      this.jwtService.signAsync(
        {id, email},
        {expiresIn: 60 * 60 * 24 * 7, secret: process.env.RT_SECRET}
      ),
      this.jwtService.signAsync(
        {id, email},
        {expiresIn: 60 * 60, secret: process.env.AT_SECRET}
      ),
    ]);
    return {refresh_token: rt, access_token: at};
  }

  hashData(value: string): Promise<string> {
    return bcrypt.hash(value, 5);
  }
}
