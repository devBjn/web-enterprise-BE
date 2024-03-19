import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePeriodRequest {
  @IsNotEmpty()
  closureDate: Date;

  @IsNotEmpty()
  finalClosureDate: Date;

  @IsString()
  @IsNotEmpty()
  academicYear: string;
}
