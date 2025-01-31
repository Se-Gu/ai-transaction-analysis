import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as csv from 'csv-parser';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { AiService } from '../ai/ai.service';
import { TransactionDto } from '../analyze/dtos/transaction.dto';

@Controller('api/')
export class FileUploadController {
  constructor(private readonly aiService: AiService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const filePath = join(__dirname, '../../../uploads', file.filename);

      // Read and parse CSV
      const transactions: TransactionDto[] = await this.parseCSV(filePath);

      // Normalize merchants
      const normalizedTransactions =
        await this.aiService.normalizeMerchants(transactions);

      // Analyze patterns
      const detectedPatterns =
        await this.aiService.analyzePatterns(transactions);

      // Clean up: Remove uploaded file
      await unlink(filePath);

      // Return final response
      return {
        normalized_transactions: normalizedTransactions,
        detected_patterns: detectedPatterns.patterns || [],
      };
    } catch (error) {
      console.error('Error processing CSV:', error);
      throw new BadRequestException('Failed to process the CSV file');
    }
  }

  private parseCSV(filePath: string): Promise<TransactionDto[]> {
    return new Promise((resolve, reject) => {
      const results: TransactionDto[] = [];

      createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          if (row.date && row.description && row.amount) {
            results.push({
              date: row.date,
              description: row.description,
              amount: parseFloat(row.amount),
            });
          }
        })
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }
}
