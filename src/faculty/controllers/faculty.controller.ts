import { Controller, Get } from '@nestjs/common';
import { FacultyService } from '../faculty.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Faculty')
@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get('get-all')
  async getAll() {
    return await this.facultyService.getAllFaculties();
  }
}
