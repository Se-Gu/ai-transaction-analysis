import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Transaction {
  @IsArray()
  description: string;

  @IsArray()
  amount: number;

  @IsArray()
  date: string;
}

export class PatternsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Transaction)
  transactions: Transaction[];
}
