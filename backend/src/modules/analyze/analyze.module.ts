import { Module } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { AnalyzeController } from './analyze.controller';
import { AiModule } from '../ai/ai.module'; // Import AiModule

@Module({
  imports: [AiModule], // Import AiModule here
  controllers: [AnalyzeController],
  providers: [AnalyzeService],
})
export class AnalyzeModule {}
