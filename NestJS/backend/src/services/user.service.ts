import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { RoleService } from './role.service';
import { DepartmentService } from './department.service';
import * as bcrypt from 'bcrypt';
import { EmailService } from './emailService';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly departmentService: DepartmentService,
    private readonly emailService: EmailService,
  ) {}

  // Update user
  public async updateUser(
    id: string,
    dto: UpdateUserDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    const updatedFields: Partial<User> = {};

    if (dto.firstName) updatedFields.firstName = dto.firstName;
    if (dto.lastName) updatedFields.lastName = dto.lastName;
    if (dto.email) updatedFields.email = dto.email;
    if (dto.password) {
      updatedFields.password = await bcrypt.hash(dto.password, 10);
    }
    if (dto.departmentId) {
      const department = await this.departmentService.getDepartmentById(
        dto.departmentId,
      );
      if (!department)
        throw new NotFoundException(
          `Department with id ${dto.departmentId} not found`,
        );
      updatedFields.department = department;
    }
    if (dto.roleId) {
      const role = await this.roleService.findRoleById(dto.roleId);
      if (!role)
        throw new NotFoundException(`Role with id ${dto.roleId} not found`);
      updatedFields.role = role;
    }

    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updatedFields)
      .where('id = :id', { id })
      .execute();

    return { message: 'User updated successfully' };
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role', 'department'],
    });
  }

  public async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .execute();

    return { message: `User with id ${id} has been deleted` };
  }

  public getUsers() {
    return this.userRepository.find({
      relations: ['role', 'department'],
    });
  }
}
