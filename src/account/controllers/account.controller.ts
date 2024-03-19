import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { AccountService } from './../account.service';
import { GetAccountResponse } from '../dtos/create.account.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RoleName } from 'src/roles/entity/roles.entity';
import { UpdateRoleAccountRequest } from '../dtos/update.role.account.dto';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('get-all')
  async findAll(): Promise<GetAccountResponse[]> {
    return await this.accountService.getAllAccounts();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
  })
  async getAccountDetail(@Param('id') id: string): Promise<GetAccountResponse> {
    return await this.accountService.getAccount(id);
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
}
