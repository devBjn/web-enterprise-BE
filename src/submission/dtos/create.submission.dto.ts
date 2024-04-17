import { IsString } from 'class-validator';
import { GetAccountResponse } from 'src/account/dtos/create.account.dto';
import { GetCommentResponse } from 'src/comment/dtos/create.comment.dto';
import { Faculty } from 'src/faculty/entity/faculty.entity';
import { GetFeedbackResponse } from 'src/feedback/dtos/create.feedback.dto';
import { Period } from 'src/period/entity/period.entity';
import { Status } from 'src/status/entity/status.entity';

export class CreateSubmissionRequest {
  @IsString()
  name: string;

  @IsString()
  description: string;

  files?: string[];
}

export class GetSubmissionResponse {
  id: string;

  name: string;

  description: string;

  createdAt: Date;

  files: string[];

  status: Status;

  period: Period;

  faculty: Faculty;

  author?: GetAccountResponse;

  likes: string[];

  publish: boolean;

  comments?: GetCommentResponse[];

  feedbacks?: GetFeedbackResponse[];
}
