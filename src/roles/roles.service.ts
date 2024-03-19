import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleName, Roles } from './entity/roles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  private getRolesBaseQuery() {
    return this.rolesRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  public async getAllRoles() {
    return await this.getRolesBaseQuery().getMany();
  }

  public async getRoleByName(name: RoleName) {
    return await this.rolesRepository.findOne({
      where: {
        name,
      },
    });
  }
}
