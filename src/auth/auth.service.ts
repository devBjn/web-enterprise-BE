import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entity/account.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AccountService } from 'src/account/account.service';
import { GetAccountResponse } from 'src/account/dtos/create.account.dto';

@Injectable()
export class AuthService {
  private code: number;
  private email: string;
  constructor(
    private readonly jwtService: JwtService,
    private readonly accountService: AccountService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  public getTokenForUser(account: Account): string {
    return this.jwtService.sign({
      username: account.username,
      sub: account.id,
    });
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async sendCodeResetPassword(email: string): Promise<object> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodemailer = require('nodemailer');
    const account = await this.accountService.getAccountByEmail(email);

    if (!account) throw new BadRequestException('Account not found !');

    this.email = account.email;
    console.log(nodemailer, 'nodemailer');
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

    this.code = Math.floor(Math.random() * 900000) + 100000;
    const mailOptions = {
      from: 'tambintv1@gmail.com',
      to: email,
      subject: 'Sending a code for user',
      text: 'New message',
      html: `<p style="font-size: '20px'; font-weight: 600">Your code is: ${this.code}</p>`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      throw new BadRequestException('Error sending email !');
    }
  }

  public checkCode(code: number): boolean {
    if (code !== this.code)
      throw new BadRequestException('The code is not valid !');

    return true;
  }

  public async resetPassword(password: string): Promise<GetAccountResponse> {
    const account = await this.accountService.getAccountByEmail(this.email);

    if (!account) throw new BadRequestException('Account not found !');

    const accountAfterResetPass = await this.accountRepository.save({
      ...account,
      password,
    });

    return {
      id: accountAfterResetPass.id,
      username: accountAfterResetPass.username,
      email: accountAfterResetPass.email,
      firstName: accountAfterResetPass.firstName,
      lastName: accountAfterResetPass.lastName,
    };
  }
}
