import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {AtStrategy, RtStrategy} from './strategies';
import {JwtModule} from '@nestjs/jwt';
import {ResetPasswordService} from "./resetPassword.service";
import {EmailService} from "../email/email.service";
import {PrismaModule} from "../prisma/prisma.module";
import {EmailModule} from "../email/email.module";
import {LoggerModule} from "../logger/logger.module";
import {LoggerService} from "../logger/logger.service";

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
    EmailModule,
    LoggerModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, ResetPasswordService, EmailService, LoggerService],
})
export class AuthModule {
}
