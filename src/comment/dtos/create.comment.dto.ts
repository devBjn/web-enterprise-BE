import { IsNotEmpty, IsOptional } from 'class-validator';
import { GetAccountResponse } from 'src/account/dtos/create.account.dto';

export class CreateCommentRequest {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  submissionId: string;

  @IsOptional()
  parentId: string;
}

export class UpdateCommentRequest {
  @IsNotEmpty()
  content: string;
}

export class GetCommentResponse {
  id: string;

  content: string;

  author?: GetAccountResponse;

  createdAt?: Date;

  updatedAt?: Date;

  submissionId?: string;

  children?: GetCommentResponse[];

  parentId?: string;
}
