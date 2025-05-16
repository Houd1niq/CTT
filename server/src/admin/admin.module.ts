import {Module} from '@nestjs/common';
import {AdminController} from './admin.controller';
import {AdminService} from './admin.service';
import {UserModule} from '../user/user.module';
import {UserService} from "../user/user.service";
import {AuthService} from "../auth/auth.service";
import {JwtService} from "@nestjs/jwt";
import {EmailService} from "../email/email.service";
import {LoggerService} from "../logger/logger.service";

@Module({
  imports: [UserModule],
  controllers: [AdminController],
  providers: [AdminService, UserService, AuthService, JwtService, EmailService, LoggerService],
  exports: [AdminService],
})
export class AdminModule {
}
