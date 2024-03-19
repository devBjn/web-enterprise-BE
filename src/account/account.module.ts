import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';
import { AccountService } from './account.service';
import { AccountController } from './controllers/account.controller';
import { RolesService } from 'src/roles/roles.service';
import { Roles } from 'src/roles/entity/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Roles])],
  providers: [AccountService, RolesService],
  controllers: [AccountController],
})
export class AccountModule {}
