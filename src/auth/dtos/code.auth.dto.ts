import { IsNotEmpty, IsNumber } from 'class-validator';

export class CodeAuthRequest {
  @IsNumber()
  @IsNotEmpty()
  code: number;
}
