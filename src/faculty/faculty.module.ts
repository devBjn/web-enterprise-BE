import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faculty } from './entity/faculty.entity';
import { FacultyService } from './faculty.service';
import { FacultyController } from './controllers/faculty.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Faculty])],
  providers: [FacultyService],
  controllers: [FacultyController],
})
export class FacultyModule {}
