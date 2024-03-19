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
import { CommentService } from '../comment.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleName } from 'src/roles/entity/roles.entity';
import {
  CreateCommentRequest,
  UpdateCommentRequest,
} from '../dtos/create.comment.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Account } from 'src/account/entity/account.entity';
import { DeleteResult } from 'typeorm';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/create')
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(RoleName.MARKETING_COORDINATOR, RoleName.STUDENT)
  async createComment(
    @Body() payload: CreateCommentRequest,
    @CurrentUser() account: Account,
  ) {
    return await this.commentService.createComment(payload, account);
  }

  @Patch('update/:id')
  @ApiParam({
    name: 'id',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(RoleName.MARKETING_COORDINATOR, RoleName.STUDENT)
  async update(
    @Param('id') id,
    @Body() payload: UpdateCommentRequest,
    @CurrentUser() account: Account,
  ) {
    const comment = await this.commentService.getComment(id);
    if (!comment) {
      throw new NotFoundException();
    }

    return await this.commentService.updateComment(comment, payload, account);
  }

  @Delete('remove/:id')
  @ApiParam({
    name: 'id',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt, RolesGuard)
  @HttpCode(204)
  @Roles(RoleName.MARKETING_COORDINATOR, RoleName.STUDENT)
  async remove(
    @Param('id') id,
    @CurrentUser() account: Account,
  ): Promise<DeleteResult> {
    const comment = await this.commentService.getComment(id);

    if (!comment) {
      throw new NotFoundException();
    }

    return await this.commentService.deleteComment(id, account.id);
  }
}
