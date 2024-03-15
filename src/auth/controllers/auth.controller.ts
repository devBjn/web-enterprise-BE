/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/account/entity/account.entity';
import { Repository } from 'typeorm';
import { AuthGuardLocal } from '../auth-guard.local';
import { CurrentUser } from '../current-user.decorator';
import { LoginAccountRequest } from 'src/account/dtos/login.account.dto';
import {
  CreateAccountRequest,
  GetAccountResponse,
} from 'src/account/dtos/create.account.dto';
import { EmailAccountRequest } from 'src/account/dtos/email.account.dto';
import { CodeAuthRequest } from '../dtos/code.auth.dto';
import { PasswordAccountRequest } from 'src/account/dtos/password.account.dto';
import { ApiTags } from '@nestjs/swagger';
import { RoleName, Roles } from 'src/roles/entity/roles.entity';
import { Faculty } from 'src/faculty/entity/faculty.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
  ) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(
    @CurrentUser() account: Account,
    @Body() loginAccountRequest: LoginAccountRequest,
  ) {
    const accountInfo: GetAccountResponse = {
      id: account.id,
      username: account.username,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      roles: account.roles,
      faculty: account.faculty,
    };
    return {
      user: accountInfo,
      token: this.authService.getTokenForUser(account),
    };
  }

  @Post('create-account')
  async createAccount(@Body() createAccountRequest: CreateAccountRequest) {
    const account = new Account();

    if (createAccountRequest.password !== createAccountRequest.retypedPassword)
      throw new BadRequestException(
        'Re-password is not the same as password !',
      );

    const existingAccount = await this.accountRepository.findOne({
      where: [
        { username: createAccountRequest.username },
        { email: createAccountRequest.email },
      ],
    });

    if (existingAccount)
      throw new BadRequestException('Username or Email is existed!');

    account.username = createAccountRequest.username;
    account.password = await this.authService.hashPassword(
      createAccountRequest.password,
    );
    account.email = createAccountRequest.email;
    account.firstName = createAccountRequest.firstName;
    account.lastName = createAccountRequest.lastName;

    const accountFaculty = await this.facultyRepository.findOne({
      where: {
        name: createAccountRequest.faculty,
      },
    });

    account.faculty = accountFaculty;

    let studentRole = await this.rolesRepository.findOne({
      where: { name: RoleName.STUDENT },
    });

    if (!studentRole) {
      studentRole = new Roles();
      studentRole.name = RoleName.STUDENT;
      studentRole.description = 'student';
      studentRole = await this.rolesRepository.save(studentRole);
    }

    account.roles = studentRole;
    const savedUser = await this.accountRepository.save(account);
    const token = this.authService.getTokenForUser(account);

    return {
      id: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      faculty: savedUser.faculty,
      roles: savedUser.roles,
      token,
    };
  }

  @Post('send-code')
  async sendCodeResetPassword(@Body() payload: EmailAccountRequest) {
    return await this.authService.sendCodeResetPassword(payload.email);
  }

  @Post('check-code')
  checkCode(@Body() payload: CodeAuthRequest) {
    return this.authService.checkCode(payload.code);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() { password, rePassword }: PasswordAccountRequest,
  ) {
    if (password !== rePassword)
      throw new BadRequestException('Re-password is not same !');

    const hashPass = await this.authService.hashPassword(password);

    return this.authService.resetPassword(hashPass);
  }
}
