import {ForbiddenException, Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {AuthConfirmDto, AuthDto} from "./dto";
import * as bcrypt from "bcryptjs";
import {TokenTypes} from "./types";
import {JwtService} from "@nestjs/jwt";
import * as process from "process";
import {EmailService} from "../email/email.service";
import {LoggerService} from "../logger/logger.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private logger: LoggerService
  ) {
  }

  async signIn(dto: AuthDto) {
    this.logger.log(`Attempting sign in for user: ${dto.email}`, 'AuthService');
    const candidate = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!candidate) {
      this.logger.warn(`Failed sign in attempt for non-existent user: ${dto.email}`, 'AuthService');
      throw new ForbiddenException("Неверный логин или пароль");
    }
    const compare = await bcrypt.compare(dto.password, candidate.hash);
    if (!compare) {
      this.logger.warn(`Failed sign in attempt for user: ${dto.email} - Invalid password`, 'AuthService');
      throw new ForbiddenException("Неверный логин или пароль");
    }

    const token = String(Math.floor(100000 + Math.random() * 900000));
    await this.prisma.user.update({
      where: {email: dto.email},
      data: {
        authConfirmToken: token,
        authConfirmTokenExpiry: new Date(Date.now() + 600000),
      },
    });

    await this.emailService.sendAuthConfirmationCode(dto.email, token)
    this.logger.log(`Confirmation code sent to user: ${dto.email}`, 'AuthService');

    return true
  }

  async confirm(dto: AuthConfirmDto) {
    const {email, code} = dto
    this.logger.log(`Attempting confirmation for user: ${email}`, 'AuthService');
    
    const user = await this.prisma.user.findUnique({
      where: {email},
    });

    if (!user || user.authConfirmToken !== code) {
      this.logger.warn(`Invalid confirmation code for user: ${email}`, 'AuthService');
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
      this.logger.warn(`Expired confirmation code for user: ${email}`, 'AuthService');
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
    this.logger.log(`User successfully authenticated: ${email}`, 'AuthService');
    return tokens;
  }

  async logout(email: string) {
    this.logger.log(`User logging out: ${email}`, 'AuthService');
    await this.prisma.user.update({
      where: {email},
      data: {
        hashedRt: null,
      },
    });
  }

  async refresh(id: number, email: string, rt: string) {
    this.logger.log(`Attempting token refresh for user: ${email}`, 'AuthService');
    const candidate = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!candidate || !candidate.hashedRt) {
      this.logger.warn(`Failed token refresh attempt for user: ${email} - No refresh token found`, 'AuthService');
      throw new ForbiddenException("Access denied");
    }
    const comparedRt = await bcrypt.compare(rt, candidate.hashedRt);
    if (!comparedRt) {
      this.logger.warn(`Failed token refresh attempt for user: ${email} - Invalid refresh token`, 'AuthService');
      throw new ForbiddenException("Access denied");
    }
    const tokens = await this.getTokens(id, email);
    await this.updateHashRtInDB(email, tokens.refresh_token);
    this.logger.log(`Token refresh successful for user: ${email}`, 'AuthService');
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
