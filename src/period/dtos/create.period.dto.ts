import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePeriodRequest {
  @IsNotEmpty()
  closureDate: string;

  @IsNotEmpty()
  finalClosureDate: string;

  @IsString()
  @IsNotEmpty()
  academicYear: string;
}
