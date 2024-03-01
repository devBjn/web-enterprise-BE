import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-local';
import { Account } from 'src/account/entity/account.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {
    super();
  }

  public async validate(username: string, password: string): Promise<any> {
    const account = await this.accountRepository.findOne({
      where: { username },
    });

    if (!account) throw new BadRequestException('Account not found !');

    if (!(await bcrypt.compare(password, account.password)))
      throw new BadRequestException('Wrong password !');

    return account;
  }
}
