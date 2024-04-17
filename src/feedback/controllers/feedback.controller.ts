import {
  Body,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { FeedbackService } from '../feedback.service';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import {
  CreateFeedbackRequest,
  UpdateFeedbackRequest,
} from '../dtos/create.feedback.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Account } from 'src/account/entity/account.entity';
import { DeleteResult } from 'typeorm';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async create(
    @Body() payload: CreateFeedbackRequest,
    @CurrentUser() account: Account,
  ) {
    return await this.feedbackService.createFeedback(payload, account);
  }

  @Patch('update/:id')
  @ApiParam({
    name: 'id',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async update(
    @Param('id') id,
    @Body() payload: UpdateFeedbackRequest,
    @CurrentUser() account: Account,
  ) {
    const feedback = await this.feedbackService.getFeedback(id);
    if (!feedback) {
      throw new NotFoundException();
    }

    return await this.feedbackService.updateFeedback(
      feedback,
      payload,
      account,
    );
  }

  @Delete('remove/:id')
  @ApiParam({
    name: 'id',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(
    @Param('id') id,
    @CurrentUser() account: Account,
  ): Promise<DeleteResult> {
    const feedback = await this.feedbackService.getFeedback(id);

    if (!feedback) {
      throw new NotFoundException();
    }

    return await this.feedbackService.deleteFeedback(id, account.id);
  }
}
