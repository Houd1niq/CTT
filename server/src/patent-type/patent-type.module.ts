import { Module } from '@nestjs/common';
import { PatentTypeService } from './patent-type.service';
import { PatentTypeController } from './patent-type.controller';

@Module({
  providers: [PatentTypeService],
  controllers: [PatentTypeController]
})
export class PatentTypeModule {}
