import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccountService } from './../account.service';
import { GetAccountResponse } from '../dtos/create.account.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleName } from 'src/roles/entity/roles.entity';
import {
  UpdateAccountRequest,
  UpdateRoleAccountRequest,
} from '../dtos/update.role.account.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('get-all')
  async findAll(): Promise<GetAccountResponse[]> {
    return await this.accountService.getAllAccounts();
  }

  @Get('token/:token')
  @ApiParam({
    name: 'token',
  })
  async getAccountDetail(
    @Param('token') token: string,
  ): Promise<GetAccountResponse> {
    return await this.accountService.getAccountByToken(token);
  }

  @Patch('/update-role/:id')
  @ApiParam({
    name: 'id',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(RoleName.ADMIN)
  async updateRole(
    @Param('id') id: string,
    @Body() payload: UpdateRoleAccountRequest,
  ): Promise<GetAccountResponse> {
    const account = await this.getAccountDetail(id);
    return await this.accountService.updateRole(account, payload);
  }

  @Patch('/update-info/:id')
  @ApiParam({
    name: 'id',
  })
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(
    RoleName.STUDENT,
    RoleName.ADMIN,
    RoleName.MARKETING_COORDINATOR,
    RoleName.MARKETING_MANAGER,
  )
  async updateInfo(
    @Param('id') id: string,
    @Body() payload: UpdateAccountRequest,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<GetAccountResponse> {
    const account = await this.getAccountDetail(id);

    return await this.accountService.updateAccountInfo(account, image, payload);
  }
}
