import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // Create role using insert query builder
  public async createRole(roleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.name = :name', { name: roleDto.name })
      .getOne();

    if (existingRole) {
      throw new ConflictException('The role already exists');
    }

    const insertResult = await this.roleRepository
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values(roleDto)
      .execute();

    // insertResult.identifiers contains the inserted id(s)
    const insertedId = insertResult.identifiers[0]?.id;
    if (!insertedId) {
      throw new ConflictException('Failed to insert role');
    }

    // Return the newly created role
    return this.findRoleById(insertedId);
  }

  // Get all roles
  public getRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  // Find role by id
  async findRoleById(roleId: number): Promise<Role> {
    const role = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.id = :id', { id: roleId })
      .getOne();

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return role;
  }

  // Update role using query builder update
  async updateRole(id: number, dto: UpdateRoleDto): Promise<Role> {
    const existingRole = await this.findRoleById(id);
    if (!existingRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    await this.roleRepository
      .createQueryBuilder()
      .update(Role)
      .set(dto)
      .where('id = :id', { id })
      .execute();

    // Return updated role
    return this.findRoleById(id);
  }

  // Delete role using query builder delete
  async deleteRole(id: number): Promise<{ message: string }> {
    const existingRole = await this.findRoleById(id);
    if (!existingRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    await this.roleRepository
      .createQueryBuilder()
      .delete()
      .from(Role)
      .where('id = :id', { id })
      .execute();

    return { message: `Role '${existingRole.name}' deleted successfully` };
  }
}
