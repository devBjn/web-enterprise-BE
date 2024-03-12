import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PeriodService } from '../period.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { Period } from '../entity/period.entity';
import { CreatePeriodRequest } from '../dtos/create.period.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Account } from 'src/account/entity/account.entity';

@ApiTags('Period')
@Controller('period')
export class PeriodController {
  constructor(private readonly periodService: PeriodService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  async createPeriod(
    @Body() payload: CreatePeriodRequest,
    @CurrentUser() account: Account,
  ): Promise<Period> {
    if ((account.roles.name = 'Marketing Coordinator')) {
      return await this.periodService.createPeriod(payload);
    } else {
      throw new UnauthorizedException();
    }
  }
}
