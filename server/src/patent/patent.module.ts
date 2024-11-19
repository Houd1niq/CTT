import {Module} from '@nestjs/common';
import {PatentService} from './patent.service';
import {PatentController} from './patent.controller';
import {PatentSearchService} from "./patentSearch.service";
import {SearchModule} from "../search-module/search-module.module";

@Module({
    providers: [PatentService, PatentSearchService],
    controllers: [PatentController],
    imports: [SearchModule]
})
export class PatentModule {
}
