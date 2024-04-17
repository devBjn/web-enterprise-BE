import { IsBoolean } from 'class-validator';

export class PublishSubmissionRequest {
  @IsBoolean()
  publish: boolean;
}
