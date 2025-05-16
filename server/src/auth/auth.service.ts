import {ForbiddenException, Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {AuthDto} from "./dto";
import * as bcrypt from "bcryptjs";
import {TokenTypes} from "./types";
import {JwtService} from "@nestjs/jwt";
// import { RevokedTokensService } from "./revokedTokens.service";
import * as process from "process";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) // private revokedTokensService: RevokedTokensService
  {
  }

  async signIn(dto: AuthDto): Promise<TokenTypes> {
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
    // await this.revokedTokensService.unRevoke(candidate.id);
    const tokens = await this.getTokens(candidate.id, candidate.email);
    await this.updateHashRtInDB(candidate.email, tokens.refresh_token);
    return tokens;
  }

  async logout(email: string) {
    // await this.revokedTokensService.revoke(userId);
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
