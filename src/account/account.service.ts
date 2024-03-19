import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account } from './entity/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAccountResponse } from './dtos/create.account.dto';
import {
  UpdateAccountRequest,
  UpdateRoleAccountRequest,
} from './dtos/update.role.account.dto';
import { RolesService } from 'src/roles/roles.service';
import { MediaService } from 'src/media/media.service';
@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly roleService: RolesService,
    private readonly mediaService: MediaService,
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
        faculty: account.faculty,
        roles: account.roles,
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
      faculty: account.faculty,
      roles: account.roles,
      dob: account.dob,
      phone: account.phone,
      address: account.address,
      avatar: account.avatar,
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
      faculty: account.faculty,
      roles: account.roles,
    };
  }

  public async updateRole(
    account: GetAccountResponse,
    payload: UpdateRoleAccountRequest,
  ) {
    const roles = await this.roleService.getRoleByName(payload.roleName);

    return await this.accountRepository.save({
      ...account,
      roles,
    });
  }

  public async updateAccountInfo(
    account: GetAccountResponse,
    image: Express.Multer.File,
    payload: UpdateAccountRequest,
  ) {
    if (image) {
      const avatar = await this.mediaService.upload(image);
      payload.avatar = avatar;
    }

    return await this.accountRepository.save({
      ...account,
      firstName: payload.firstName,
      lastName: payload.lastName,
      dob: payload.dob,
      phone: payload.phone,
      address: payload.address,
      ...(image && { avatar: payload.avatar }),
    });
  }
}
