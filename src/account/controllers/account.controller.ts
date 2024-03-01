import { Controller, Get, Param } from '@nestjs/common';
import { AccountService } from './../account.service';
import { GetAccountResponse } from '../dtos/create.account.dto';
import { ApiParam } from '@nestjs/swagger';
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
}
