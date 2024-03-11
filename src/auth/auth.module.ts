import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/account/entity/account.entity';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import { AccountService } from 'src/account/account.service';
import { Roles } from 'src/roles/entity/roles.entity';
import { Faculty } from 'src/faculty/entity/faculty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Roles, Faculty]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.AUTH_SECRET,
        signOptions: {
          expiresIn: '60m',
        },
      }),
    }),
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService, AccountService],
  controllers: [AuthController],
})
export class AuthModule {}
