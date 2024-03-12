import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from './entity/status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  private getStatusBaseQuery() {
    return this.statusRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }
}
