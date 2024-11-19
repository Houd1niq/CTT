import { Module } from '@nestjs/common';
import { TechnologyFieldController } from './technology-field.controller';
import { TechnologyFieldService } from './technology-field.service';

@Module({
  controllers: [TechnologyFieldController],
  providers: [TechnologyFieldService]
})
export class TechnologyFieldModule {}
