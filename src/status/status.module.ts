import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entity/status.entity';
import { StatusService } from './status.service';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  providers: [StatusService],
  controllers: [],
})
export class StatusModule {}
