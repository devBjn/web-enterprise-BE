import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Submissions } from 'src/submission/entity/submission.entity';
import { CommentService } from './comment.service';
import { CommentController } from './controllers/comment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Submissions])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
