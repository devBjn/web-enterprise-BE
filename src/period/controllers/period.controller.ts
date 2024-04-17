import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PeriodService } from '../period.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
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
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(RoleName.ADMIN)
  async createPeriod(@Body() payload: CreatePeriodRequest): Promise<Period> {
    return await this.periodService.createPeriod(payload);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
  })
  @UseGuards(AuthGuardJwt)
  async getDetail(@Param('id') id: string): Promise<Period> {
    return await this.periodService.getPeriod(id);
  }
}
