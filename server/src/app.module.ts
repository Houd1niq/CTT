import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
import { PatentModule } from './patent/patent.module';
import { SearchModule } from './search-module/search-module.module';
import { PatentTypeModule } from './patent-type/patent-type.module';
import { TechnologyFieldModule } from './technology-field/technology-field.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PatentModule,
    SearchModule,
    PatentTypeModule,
    TechnologyFieldModule,
    FilesModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'static'),
    // }),
  ],
  controllers: [],
})
export class AppModule {}
