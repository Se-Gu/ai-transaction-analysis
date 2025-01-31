import { Controller, Post, Body } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { TransactionDto } from './dtos/transaction.dto';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post('merchant')
  normalizeMerchant(@Body() transaction: TransactionDto) {
    return this.analyzeService.normalizeMerchant(transaction);
  }

  @Post('merchants')
  normalizeMerchants(@Body() transactions: TransactionDto[]) {
    return this.analyzeService.normalizeMerchants(transactions);
  }

  @Post('patterns')
  detectPatterns(@Body() transactions: TransactionDto[]) {
    return this.analyzeService.detectPatterns(transactions);
  }
}
