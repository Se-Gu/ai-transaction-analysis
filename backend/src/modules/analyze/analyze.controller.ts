import { Controller, Post, Body } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { MerchantDto } from 'src/modules/analyze/dtos/merchant.dto';
import { PatternsDto } from './dtos/patterns.dto';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post('merchant')
  normalizeMerchant(@Body() merchantDto: MerchantDto) {
    return this.analyzeService.normalizeMerchant(merchantDto);
  }

  @Post('patterns')
  detectPatterns(@Body() patternsDto: PatternsDto) {
    return this.analyzeService.detectPatterns(patternsDto.transactions);
  }
}
