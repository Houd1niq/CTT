import { Module } from '@nestjs/common';
import { PatentService } from './patent.service';
import { PatentController } from './patent.controller';

@Module({
  providers: [PatentService],
  controllers: [PatentController]
})
export class PatentModule {}
