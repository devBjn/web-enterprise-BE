import { IsNotEmpty } from 'class-validator';
import { GetAccountResponse } from 'src/account/dtos/create.account.dto';

export class CreateFeedbackRequest {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  submissionId: string;
}

export class UpdateFeedbackRequest {
  @IsNotEmpty()
  content: string;
}

export class GetFeedbackResponse {
  id: string;

  content: string;

  author?: GetAccountResponse;

  createdAt?: Date;

  updatedAt?: Date;

  submissionId?: string;
}
