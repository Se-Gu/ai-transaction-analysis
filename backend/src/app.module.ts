import { Module } from '@nestjs/common';
import { AnalyzeModule } from './modules/modules/analyze/analyze.module';

@Module({
  imports: [AnalyzeModule],
})
export class AppModule {}
