import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dtos/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  public async createRole(RoleDto: CreateRoleDto) {
    //if a role exits already, then do not create it
    const role = await this.roleRepository.findOne({
      where: { name: RoleDto.name },
    });
    //handle the error
    if (role) {
      return 'The role already exits';
    }
    //create role
    const newRole = this.roleRepository.create(RoleDto);
    return this.roleRepository.save(newRole);
  }

  getRoles() {
    return this.roleRepository.find();
  }
}
