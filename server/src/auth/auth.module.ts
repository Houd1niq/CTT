import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { RevokedTokensService } from './revokedTokens.service';
import {ResetPasswordService} from "./resetPassword.service";

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, RevokedTokensService, ResetPasswordService],
})
export class AuthModule {}
