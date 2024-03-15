import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PeriodService } from '../period.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { Period } from '../entity/period.entity';
import { CreatePeriodRequest } from '../dtos/create.period.dto';
import { Roles } from 'src/roles/roles.decorator';
import { RoleName } from 'src/roles/entity/roles.entity';
import { RolesGuard } from 'src/roles/roles.guard';

@ApiTags('Period')
@Controller('period')
export class PeriodController {
  constructor(private readonly periodService: PeriodService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuardJwt)
  @Roles(RoleName.MARKETING_COORDINATOR)
  @UseGuards(RolesGuard)
  async createPeriod(@Body() payload: CreatePeriodRequest): Promise<Period> {
    return await this.periodService.createPeriod(payload);
  }
}
