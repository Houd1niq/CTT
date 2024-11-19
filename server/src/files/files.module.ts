import {Module} from '@nestjs/common';
import {FilesController} from './files.controller';
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [JwtModule.register({})],
    controllers: [FilesController]
})
export class FilesModule {
}
