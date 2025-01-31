import { Injectable } from '@nestjs/common';
import { TransactionDto } from './dtos/transaction.dto';
import { AiService } from '../ai/ai.service';

@Injectable()
export class AnalyzeService {
  constructor(private readonly aiService: AiService) {}

  normalizeMerchant(transaction: TransactionDto) {
    return this.aiService.normalizeMerchant(transaction);
  }

  normalizeMerchants(transactions: TransactionDto[]) {
    return this.aiService.normalizeMerchants(transactions);
  }

  detectPatterns(transactions: TransactionDto[]) {
    return this.aiService.analyzePatterns(transactions);
  }
}
