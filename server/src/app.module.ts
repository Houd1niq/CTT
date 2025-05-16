import {Module} from "@nestjs/common";
import {PrismaModule} from "./prisma/prisma.module";
import {AuthModule} from "./auth/auth.module";
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
import {PatentModule} from './patent/patent.module';
import {SearchModule} from './search-module/search-module.module';
import {PatentTypeModule} from './patent-type/patent-type.module';
import {TechnologyFieldModule} from './technology-field/technology-field.module';
import {FilesModule} from './files/files.module';
import {UserModule} from "./user/user.module";
import {EmailModule} from './email/email.module';
import {MailerModule} from "@nestjs-modules/mailer";
import {SchedulerModule} from './scheduler/scheduler.module';
import * as process from "process";
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from "path";
import {InstituteModule} from './institute/institute.module';
import {AdminModule} from './admin/admin.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PatentModule,
    SearchModule,
    PatentTypeModule,
    TechnologyFieldModule,
    FilesModule,
    UserModule,
    EmailModule,
    InstituteModule,
    AdminModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_LOGIN,
          pass: process.env.SMTP_PASS,
        },
      },
    }),
    SchedulerModule,
  ],
  controllers: [],
})
export class AppModule {
}
