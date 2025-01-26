import { Controller, Post, Body } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { MerchantDto } from 'src/dtos/merchant.dto';

@Controller('analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Post('merchant')
  normalizeMerchant(@Body() merchantDto: MerchantDto) {
    return this.analyzeService.normalizeMerchant(merchantDto);
  }
}
