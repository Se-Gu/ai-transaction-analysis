import { IsString, IsNotEmpty } from 'class-validator';

export class MerchantDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}
