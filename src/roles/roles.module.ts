import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './entity/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  providers: [],
  controllers: [],
})
export class RolesModule {}
