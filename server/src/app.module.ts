import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'static'),
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
