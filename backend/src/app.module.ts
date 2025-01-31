import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnalyzeModule } from './modules/analyze/analyze.module';
import { AiModule } from './modules/ai/ai.module';
import { RedisModule } from './shared/redis.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes environment variables accessible throughout the app
    }),
    AnalyzeModule,
    AiModule,
    RedisModule,
    FileUploadModule,
  ],
})
export class AppModule {}
