import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { SubmissionService } from '../submission.service';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleName } from 'src/roles/entity/roles.entity';
import { CreateSubmissionRequest } from '../dtos/create.submission.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Account } from 'src/account/entity/account.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateSubmissionRequest } from '../dtos/update.submission.dto';

@Controller('submission')
@ApiTags('Submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post('/create')
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(RoleName.STUDENT)
  @UseInterceptors(FilesInterceptor('files'))
  async createSubmission(
    @Body() payload: CreateSubmissionRequest,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() account: Account,
  ) {
    return await this.submissionService.createSubmission(
      payload,
      files,
      account,
    );
  }

  @Get('/not-approved-submissions-list')
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(RoleName.MARKETING_COORDINATOR)
  async getNotApprovedSubmissionsList() {
    return await this.submissionService.getNotApprovedSubmissionsList();
  }

  @Get('/approved-submissions-list')
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async getApprovedSubmissionsList() {
    return await this.submissionService.getApprovedSubmissionsList();
  }

  @Get('/detail/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
  })
  async getSubmissionDetail(@Param('id') id) {
    return await this.submissionService.getSubmissionDetail(id);
  }

  @Patch('/update/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
  })
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(RoleName.STUDENT)
  @UseInterceptors(FilesInterceptor('files'))
  async updateSubmission(
    @Param('id') id,
    @Body() payload: UpdateSubmissionRequest,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() account: Account,
  ) {
    const submission = await this.submissionService.getSubmissionDetail(id);
    return await this.submissionService.updateSubmission(
      payload,
      files,
      account,
      submission,
    );
  }

  @Patch('/approve/:id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
  })
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(RoleName.MARKETING_COORDINATOR)
  async approveSubmission(@Param('id') id) {
    const submission = await this.submissionService.getSubmissionDetail(id);
    return await this.submissionService.approveSubmission(submission);
  }
}
