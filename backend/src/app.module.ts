import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyzeModule } from './modules/analyze/analyze.module';
import { AiModule } from './modules/ai/ai.module';
import { RedisModule } from './shared/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes environment variables accessible throughout the app
    }),
    AnalyzeModule,
    AiModule,
    RedisModule,
  ],
})
export class AppModule {}
