import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {AtStrategy, RtStrategy} from './strategies';
import {JwtModule} from '@nestjs/jwt';
import {ResetPasswordService} from "./resetPassword.service";
import {EmailService} from "../email/email.service";

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, ResetPasswordService, EmailService],
})
export class AuthModule {
}
