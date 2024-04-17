/* eslint-disable @typescript-eslint/no-var-requires */
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
import { JwtService } from '@nestjs/jwt';
import {
  CreateAccountClientRequest,
  CreateStudentRequest,
} from './dtos/create.account.client.dto';
import { FacultyService } from 'src/faculty/faculty.service';
import * as bcrypt from 'bcrypt';
import { RoleName } from 'src/roles/entity/roles.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly roleService: RolesService,
    private readonly mediaService: MediaService,
    private readonly jwtService: JwtService,
    private readonly facultyService: FacultyService,
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

  public async getAccountByToken(
    token: string,
  ): Promise<GetAccountResponse | undefined> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.AUTH_SECRET,
    });
    return await this.getAccount(payload.sub);
  }

  public async getAccountByEmail(
    email: string,
  ): Promise<GetAccountResponse | undefined> {
    const account = await this.getAccountsBaseQuery()
      .andWhere('e.email = :email', {
        email,
      })
      .getOne();
    if (!account) throw new BadRequestException('Account not found !');
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

  private generatePassword(length) {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  private async sendEmail(
    email: string,
    username: string,
    password: string,
  ): Promise<void> {
    const nodemailer = require('nodemailer');

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

    const mailOptions = {
      from: 'tambintv1@gmail.com',
      to: email,
      subject: 'Sending a username & password for client',
      text: 'New message',
      html: `<p style="font-size: '20px'; font-weight: 600">Your username is: ${username}</p>
       <p style="font-size: '20px'; font-weight: 600">Your password is: ${password}</p>
       <p style="font-size: '20px'; font-weight: 600">Your email is: ${email}</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error('Error sending email');
    }
  }

  public async createAccountForClient(
    createClient: CreateAccountClientRequest,
    createStudent: CreateStudentRequest,
    user: Account,
  ): Promise<GetAccountResponse> {
    const account = new Account();
    const pass = this.generatePassword(8);

    if (!createStudent) {
      const existingAccount = await this.accountRepository.findOne({
        where: [
          { username: createClient.username },
          { email: createClient.email },
        ],
      });

      if (existingAccount)
        throw new BadRequestException('Username or Email is existed!');

      account.username = createClient.username;
      account.password = await bcrypt.hash(pass, 10);
      account.email = createClient.email;
      account.firstName = createClient.firstName;
      account.lastName = createClient.lastName;

      account.roles = await this.roleService.getRoleByName(createClient.roles);
      const accountFaculty = await this.facultyService.getFacultyByName(
        createClient.faculty,
      );

      account.faculty = accountFaculty;
    } else {
      const existingAccount = await this.accountRepository.findOne({
        where: [
          { username: createStudent.username },
          { email: createStudent.email },
        ],
      });

      if (existingAccount)
        throw new BadRequestException('Username or Email is existed!');

      account.username = createStudent.username;
      account.password = await bcrypt.hash(pass, 10);
      account.email = createStudent.email;
      account.firstName = createStudent.firstName;
      account.lastName = createStudent.lastName;

      account.roles = await this.roleService.getRoleByName(RoleName.STUDENT);
      const accountFaculty = await this.facultyService.getFacultyByName(
        user.faculty.name,
      );

      account.faculty = accountFaculty;
    }

    const savedUser = await this.accountRepository.save(account);

    await this.sendEmail(savedUser.email, savedUser.username, pass).catch(
      (error) => {
        console.error('Error sending email:', error);
      },
    );

    return savedUser;
  }

  public async deleteClient(id: string) {
    return await this.accountRepository
      .createQueryBuilder('client')
      .delete()
      .where('id = :id', {
        id,
      })
      .execute();
  }
}
