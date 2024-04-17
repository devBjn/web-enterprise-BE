/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Submissions } from './entity/submission.entity';
import { DeleteResult, Repository } from 'typeorm';
import {
  CreateSubmissionRequest,
  GetSubmissionResponse,
} from './dtos/create.submission.dto';
import { Status } from 'src/status/entity/status.entity';
import { Period } from 'src/period/entity/period.entity';
import { Account } from 'src/account/entity/account.entity';
import { MediaService } from 'src/media/media.service';
import { Comment } from 'src/comment/entity/comment.entity';
import { GetCommentResponse } from 'src/comment/dtos/create.comment.dto';
import { UpdateSubmissionRequest } from './dtos/update.submission.dto';
import { AccountService } from 'src/account/account.service';
import { RoleName } from 'src/roles/entity/roles.entity';
import { Feedback } from 'src/feedback/entity/feedback.entity';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submissions)
    private readonly submissionRepository: Repository<Submissions>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(Period)
    private readonly periodRepository: Repository<Period>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    private readonly mediaService: MediaService,
    private readonly accountService: AccountService,
  ) {}

  private getSubmissionBaseQuery() {
    return this.submissionRepository
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

  private async getAllFeedbacksBySubmission(id: string) {
    return await this.feedbackRepository
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
      .leftJoin('e.submission', 'submission')
      .andWhere('submission.id = :id', { id })
      .getMany();
  }

  private async getAllCommentBySubmission(id: string) {
    return await this.commentRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC')
      .leftJoin('e.author', 'account')
      .leftJoinAndSelect('e.children', 'children')
      .leftJoinAndSelect('e.parent', 'parent')
      .addSelect([
        'account.id',
        'account.username',
        'account.email',
        'account.firstName',
        'account.lastName',
        'account.roles',
        'account.faculty',
      ])
      .leftJoin('e.submission', 'submission')
      .andWhere('submission.id = :id', { id })
      .getMany();
  }

  private async sendNotifyByEmail(email: string): Promise<object> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tambintv1@gmail.com',
        pass: 'vdba tjns zelf koqt',
      },
      port: 587,
      secure: false,
      requireTLS: true,
    });
    const submissionLink = 'https://www.google.com/'; //link to detail submission
    const mailOptions = {
      from: 'tambintv1@gmail.com',
      to: email,
      subject: 'Notification: Submission Ready for Review',
      text:
        'Hello Coordinator,\nA new submission from a student is ready for review. Please click the link below to check:\n' +
        submissionLink +
        '\n\nThank you!',
      html: `
              <html>
                  <head>
                      <title>Submission Notification</title>
                  </head>
                  <body>
                      <h1>Submission Notification</h1>
                      <p>Hello Coordinator,</p>
                      <p>A new submission from a student is ready for review. Please click the link below to check:</p>
                      <p><a href="${submissionLink}">Check Submission</a></p>
                      <p>Thank you!</p>
                  </body>
              </html>
          `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new BadRequestException('Error sending email !');
    }
  }

  private async sendEmailForCoordinator() {
    this.accountService.getAllAccounts().then(async (accountList) => {
      const accountCoordinators = accountList.filter(
        (account) => account.roles.name === RoleName.MARKETING_COORDINATOR,
      );
      const emailPromises = accountCoordinators.map(async (account) =>
        this.sendNotifyByEmail(account.email),
      );

      await Promise.all(emailPromises)
        .then(() => console.log('Emails sent successfully!'))
        .catch((error) => console.error('Error sending emails:', error));
    });
  }

  public async getSubmissionDetail(id: string): Promise<GetSubmissionResponse> {
    const submission = await this.getSubmissionBaseQuery()
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
      .andWhere('e.id = :id', { id })
      .getOne();

    if (!submission) throw new BadRequestException('Submission not found !');

    const commentList = await this.getAllCommentBySubmission(submission.id);
    const commentsMapped = commentList.map((comment) =>
      this.mappedComment(comment),
    );
    const comments = commentsMapped.filter((comment) => !comment.parentId);
    const feedbacks = await this.getAllFeedbacksBySubmission(submission.id);
    return {
      id: submission.id,
      name: submission.name,
      description: submission.description,
      createdAt: submission.createdAt,
      files: submission.files,
      status: submission.status,
      period: submission.period,
      author: submission.author,
      faculty: submission.author.faculty,
      likes: submission.likes || [],
      publish: submission.publish,
      feedbacks,
      comments,
    };
  }

  public async createSubmission(
    payload: CreateSubmissionRequest,
    files: Array<Express.Multer.File>,
    account: Account,
  ): Promise<GetSubmissionResponse> {
    let statusSubmission = await this.statusRepository.findOne({
      where: {
        name: 'Not approved',
      },
    });
    if (!statusSubmission) {
      const status = new Status();
      status.name = 'Not approved';
      status.description = 'A submission does not approved yet !';
      statusSubmission = await this.statusRepository.save(status);
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const periodSubmission = await this.periodRepository.findOne({
      where: {
        academicYear: currentYear.toString(),
      },
    });

    const { password, ...info } = account;
    const fileUrl = Promise.all(
      files.map(async (file) => await this.mediaService.upload(file)),
    );
    payload.files = await fileUrl;
    const submission = await this.submissionRepository.save({
      ...payload,
      status: statusSubmission,
      period: periodSubmission,
      createdAt: new Date(),
      author: info,
      likes: [],
    });

    await this.sendEmailForCoordinator();
    return {
      ...submission,
      faculty: account.faculty,
      publish: false,
    };
  }

  public async getApprovedSubmissionsList() {
    const submissionsList = await this.getSubmissionBaseQuery()
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
      .getMany();
    return submissionsList.filter(
      (submission) => submission.status.name === 'Approved',
    );
  }

  public async getNotApprovedSubmissionsList() {
    const submissionsList = await this.getSubmissionBaseQuery()
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
      .getMany();

    return submissionsList.filter(
      (submission) => submission.status.name === 'Not approved',
    );
  }

  public async updateSubmission(
    payload: UpdateSubmissionRequest,
    files: Array<Express.Multer.File>,
    account: Account,
    submission: GetSubmissionResponse,
  ): Promise<GetSubmissionResponse> {
    if (submission.author.id === account.id) {
      const fileUrl = await Promise.all(
        files.map(async (file) => await this.mediaService.upload(file)),
      );
      payload.files = fileUrl;
      const result = await this.submissionRepository.save({
        ...submission,
        name: payload.name,
        description: payload.description,
        files: payload.files,
      });
      return result;
    } else {
      throw new BadRequestException('You can not edit submission !');
    }
  }

  public async approveSubmission(submission: GetSubmissionResponse) {
    let statusSubmission = await this.statusRepository.findOne({
      where: {
        name: 'Approved',
      },
    });
    if (!statusSubmission) {
      const status = new Status();
      status.name = 'Approved';
      status.description = 'A submission is approved !';
      statusSubmission = await this.statusRepository.save(status);
    }
    return await this.submissionRepository.save({
      ...submission,
      status: statusSubmission,
    });
  }

  public async deniedSubmission(submission: GetSubmissionResponse) {
    let statusSubmission = await this.statusRepository.findOne({
      where: {
        name: 'Denied',
      },
    });

    if (!statusSubmission) {
      const status = new Status();
      status.name = 'Denied';
      status.description = 'A submission is denied !';
      statusSubmission = await this.statusRepository.save(status);
    }

    return await this.submissionRepository.save({
      ...submission,
      status: statusSubmission,
    });
  }

  public async removeSubmission(
    id: string,
    authorId: string,
  ): Promise<DeleteResult> {
    return await this.submissionRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id and author = :authorId', {
        id,
        authorId,
      })
      .execute();
  }

  public async removeSubmissionByManager(id: string) {
    return await this.submissionRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', {
        id,
      })
      .execute();
  }

  async like(
    submissionId: string,
    account: Account,
  ): Promise<GetSubmissionResponse> {
    const submission = await this.getSubmissionDetail(submissionId);
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const hasLiked = submission.likes.includes(account.id);

    if (!hasLiked) {
      submission.likes.push(account.id);
      const result = await this.submissionRepository.save(submission);

      return {
        id: result.id,
        name: result.name,
        description: result.description,
        createdAt: result.createdAt,
        files: result.files,
        status: result.status,
        period: result.period,
        faculty: result.author.faculty,
        author: result.author,
        comments: result.comments,
        feedbacks: result.feedbacks,
        likes: result.likes,
        publish: result.publish,
      };
    } else {
      return submission;
    }
  }

  async unlike(
    submissionId: string,
    account: Account,
  ): Promise<GetSubmissionResponse> {
    const submission = await this.getSubmissionDetail(submissionId);

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }
    const hasLiked = submission.likes.includes(account.id);

    if (hasLiked) {
      submission.likes = submission.likes.filter(
        (id: string) => id !== account.id,
      );

      const result = await this.submissionRepository.save(submission);
      return {
        id: result.id,
        name: result.name,
        description: result.description,
        createdAt: result.createdAt,
        files: result.files,
        status: result.status,
        period: result.period,
        faculty: result.author.faculty,
        author: result.author,
        comments: result.comments,
        feedbacks: result.feedbacks,
        likes: result.likes,
        publish: result.publish,
      };
    } else {
      return submission;
    }
  }

  public async handlePublishSubmission(
    submission: GetSubmissionResponse,
    publish: boolean,
  ) {
    return await this.submissionRepository.save({
      ...submission,
      publish,
    });
  }

  public async getSubmissionListByAccount(account: Account) {
    switch (account.roles.name) {
      case RoleName.ADMIN:
        return await this.getSubmissionBaseQuery()
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
          .getMany();

      case RoleName.MARKETING_MANAGER:
        return await this.getSubmissionBaseQuery()
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
          .getMany();

      case RoleName.MARKETING_COORDINATOR:
        return await this.getSubmissionBaseQuery()
          .leftJoin('e.author', 'account')
          .leftJoin('account.faculty', 'faculty')
          .addSelect([
            'account.id',
            'account.username',
            'account.email',
            'account.firstName',
            'account.lastName',
            'account.roles',
            'account.faculty',
          ])
          .where('faculty.name = :name', {
            name: account.faculty.name,
          })
          .getMany();

      case RoleName.STUDENT:
        return await this.getSubmissionBaseQuery()
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
          .where('account.id = :id', {
            id: account.id,
          })
          .getMany();

      case RoleName.GUEST:
        return await this.getApprovedSubmissionsList();

      default:
        break;
    }
  }
}
