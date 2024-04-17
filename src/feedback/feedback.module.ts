import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entity/feedback.entity';
import { Submissions } from 'src/submission/entity/submission.entity';
import { FeedbackController } from './controllers/feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, Submissions])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
