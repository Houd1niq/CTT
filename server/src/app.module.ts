import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
import { PatentModule } from './patent/patent.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PatentModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'static'),
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
