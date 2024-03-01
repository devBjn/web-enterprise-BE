import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account } from './entity/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAccountResponse } from './dtos/create.account.dto';
@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  private getAccountsBaseQuery() {
    return this.accountRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  private async checkExistAccount(id: string): Promise<Account> {
    const account = await this.getAccountsBaseQuery()
      .andWhere('e.id = :id', { id })
      .getOne();

    if (!account) {
      throw new BadRequestException('Account not found!');
    }
    return account;
  }

  public async getAllAccounts(): Promise<GetAccountResponse[]> {
    const accountList = await this.getAccountsBaseQuery().getMany();
    return accountList.map((account) => {
      return {
        id: account.id,
        username: account.username,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
      };
    });
  }

  public async getAccount(id: string): Promise<GetAccountResponse | undefined> {
    const account = await this.checkExistAccount(id);
    return {
      id: account.id,
      username: account.username,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
    };
  }

  public async getAccountByEmail(
    email: string,
  ): Promise<GetAccountResponse | undefined> {
    const account = await this.getAccountsBaseQuery()
      .andWhere('e.email = :email', {
        email,
      })
      .getOne();

    return {
      id: account.id,
      username: account.username,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
    };
  }
}
