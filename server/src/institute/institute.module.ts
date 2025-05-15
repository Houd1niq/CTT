import { Module } from '@nestjs/common';
import { InstituteService } from './institute.service';
import { InstituteController } from './institute.controller';

@Module({
  providers: [InstituteService],
  controllers: [InstituteController]
})
export class InstituteModule {} 