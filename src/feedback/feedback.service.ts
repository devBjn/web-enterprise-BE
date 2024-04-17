/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Submissions } from 'src/submission/entity/submission.entity';
import { Account } from 'src/account/entity/account.entity';
import { Feedback } from './entity/feedback.entity';
import {
  CreateFeedbackRequest,
  GetFeedbackResponse,
  UpdateFeedbackRequest,
} from './dtos/create.feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(Submissions)
    private readonly submissionRepository: Repository<Submissions>,
  ) {}

  private getFeedbacksBaseQuery() {
    return this.feedbackRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  private async getSubmissionDetailQuery(id: string) {
    return await this.submissionRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC')
      .leftJoin('e.author', 'account')
      .addSelect([
        'account.id',
        'account.username',
        'account.email',
        'account.firstName',
        'account.lastName',
        'account.roles',
        'account.faculty',
      ])
      .andWhere('e.id = :id', {
        id,
      })
      .getOne();
  }

  public async getFeedback(id: string) {
    const result = await this.getFeedbacksBaseQuery()
      .leftJoin('e.author', 'account')
      .leftJoinAndSelect('e.submission', 'submission')
      .addSelect([
        'account.id',
        'account.username',
        'account.email',
        'account.firstName',
        'account.lastName',
        'account.roles',
        'account.faculty',
      ])
      .andWhere('e.id = :id', {
        id,
      })
      .getOne();
    return {
      id: result.id,
      content: result.content,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      author: result.author,
      submissionId: result.submission.id,
    };
  }

  public async createFeedback(
    payload: CreateFeedbackRequest,
    account: Account,
  ) {
    const submission = await this.getSubmissionDetailQuery(
      payload.submissionId,
    );

    const createdComment = await this.feedbackRepository.save({
      content: payload.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      submission,
      author: account,
    });

    const { password, ...info } = account;
    const comment = {
      id: createdComment.id,
      content: createdComment.content,
      createdAt: createdComment.createdAt,
      updatedAt: createdComment.updatedAt,
      author: info,
      submissionId: createdComment.submission.id,
    };

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.author,
      submission,
      submissionId: comment.submissionId,
    };
  }

  public async updateFeedback(
    feedback: GetFeedbackResponse,
    payload: UpdateFeedbackRequest,
    account: Account,
  ) {
    const submission = await this.getSubmissionDetailQuery(
      feedback.submissionId,
    );
    if (feedback.author.id === account.id) {
      const updatedComment = await this.feedbackRepository.save({
        id: feedback.id,
        content: payload.content,
        createdAt: feedback.createdAt,
        updatedAt: new Date(),
        submission,
        author: account,
      });
      const { password, ...info } = account;
      return {
        id: updatedComment.id,
        content: updatedComment.content,
        createdAt: updatedComment.createdAt,
        updatedAt: updatedComment.updatedAt,
        author: info,
        submission: updatedComment.submission.id,
      };
    }
    throw new BadRequestException('You can not update this feedback !');
  }

  public async deleteFeedback(
    id: string,
    authorId: string,
  ): Promise<DeleteResult> {
    return await this.feedbackRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id and author = :authorId', {
        id,
        authorId,
      })
      .execute();
  }
}
