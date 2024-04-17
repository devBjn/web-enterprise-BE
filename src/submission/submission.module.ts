import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submissions } from './entity/submission.entity';
import { Status } from 'src/status/entity/status.entity';
import { Period } from 'src/period/entity/period.entity';
import { SubmissionController } from './controllers/submission.controller';
import { SubmissionService } from './submission.service';
import { MediaService } from 'src/media/media.service';
import { FirebaseService } from 'src/firebase/firebase.image.service';
import { Comment } from 'src/comment/entity/comment.entity';
import { CommentService } from 'src/comment/comment.service';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/account/entity/account.entity';
import { RolesService } from 'src/roles/roles.service';
import { Roles } from 'src/roles/entity/roles.entity';
import { JwtService } from '@nestjs/jwt';
import { FacultyService } from 'src/faculty/faculty.service';
import { Faculty } from 'src/faculty/entity/faculty.entity';
import { Feedback } from 'src/feedback/entity/feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Submissions,
      Status,
      Period,
      Comment,
      Account,
      Roles,
      Faculty,
      Feedback,
    ]),
  ],
  controllers: [SubmissionController],
  providers: [
    SubmissionService,
    MediaService,
    FirebaseService,
    CommentService,
    AccountService,
    RolesService,
    JwtService,
    FacultyService,
  ],
})
export class SubmissionModule {}
