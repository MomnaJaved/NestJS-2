import { Injectable, ConflictException } from '@nestjs/common';
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

  // Method to create a role
  public async createRole(roleDto: CreateRoleDto) {
    // Check if the role already exists by name
    const existingRole = await this.roleRepository.findOne({
      where: { name: roleDto.name },
    });

    // If the role exists, throw a ConflictException
    if (existingRole) {
      throw new ConflictException('The role already exists');
    }

    // If the role does not exist, create and save the new role
    const newRole = this.roleRepository.create(roleDto);
    return this.roleRepository.save(newRole);
  }

  // Method to get all roles
  public getRoles() {
    return this.roleRepository.find();
  }

  // Fetch role by roleId, treating roleId as a number
  async findRoleById(roleId: number): Promise<Role | null> {
    // Use `where` to query based on `id`
    return this.roleRepository.findOne({
      where: { id: roleId }, // Specify the query structure correctly
    });
  }
}
