/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Submissions } from 'src/submission/entity/submission.entity';
import {
  CreateCommentRequest,
  GetCommentResponse,
  UpdateCommentRequest,
} from './dtos/create.comment.dto';
import { Account } from 'src/account/entity/account.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Submissions)
    private readonly submissionRepository: Repository<Submissions>,
  ) {}

  private getCommentsBaseQuery() {
    return this.commentRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  private mappedComment(comment: Comment): GetCommentResponse {
    const commentResponse: GetCommentResponse = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.author,
      ...(comment.submission && { submissionId: comment.submission.id }),
      ...(comment.parent && { parentId: comment.parent.id }),
    };

    if (comment.children && comment.children.length) {
      commentResponse.children = comment.children.map((child) =>
        this.mappedComment(child),
      );
    }

    return commentResponse;
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

  public async getComment(id: string) {
    const result = await this.getCommentsBaseQuery()
      .leftJoin('e.author', 'account')
      .leftJoinAndSelect('e.children', 'children')
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
      // children: result.children,
      parentId: result.parent ? result.parent.id : null,
    };
  }

  public async createComment(payload: CreateCommentRequest, account: Account) {
    const submission = await this.getSubmissionDetailQuery(
      payload.submissionId,
    );

    let parentComment = null;
    if (payload.parentId) {
      parentComment = await this.commentRepository.findOne({
        where: {
          id: payload.parentId,
        },
      });
    }

    const createdComment = await this.commentRepository.save({
      content: payload.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      submission,
      parent: parentComment ?? null,
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
      children: [],
      ...(createdComment.parent && { parentId: createdComment.parent.id }),
    };

    const parentCmt = await this.commentRepository.findOne({
      where: {
        id: payload.parentId,
      },
    });
    const payloadParam = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.author,
      submission,
      children: comment.children,
      submissionId: comment.submissionId,
      ...(comment.parentId && { parent: parentCmt }),
    };
    return this.mappedComment(payloadParam);
  }

  public async updateComment(
    comment: GetCommentResponse,
    payload: UpdateCommentRequest,
    account: Account,
  ) {
    const submission = await this.getSubmissionDetailQuery(
      comment.submissionId,
    );
    if (comment.author.id === account.id) {
      const updatedComment = await this.commentRepository.save({
        id: comment.id,
        content: payload.content,
        createdAt: comment.createdAt,
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
    throw new BadRequestException('You can not update this comment !');
  }

  public async deleteComment(
    id: string,
    authorId: string,
  ): Promise<DeleteResult> {
    return await this.commentRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id and author = :authorId', {
        id,
        authorId,
      })
      .execute();
  }
}
