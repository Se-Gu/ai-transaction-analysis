import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { AiService } from '../ai/ai.service';

@Module({
  imports: [MulterModule.register({ dest: './uploads' })],
  controllers: [FileUploadController],
  providers: [AiService],
})
export class FileUploadModule {}
