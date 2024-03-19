import { IsString } from 'class-validator';

export class UpdateSubmissionRequest {
  @IsString()
  name: string;

  @IsString()
  description: string;

  files?: string[];
}
