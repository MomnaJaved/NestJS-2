import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { RoleService } from '../roles/role.service';
import { DepartmentService } from '../departments/department.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly departmentService: DepartmentService,
  ) {}

  // Create a new user
  public async createUser(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: createUserDto.email })
      .getOne();

    if (existingUser) {
      throw new ConflictException('The user already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const role = await this.roleService.findRoleById(createUserDto.roleId);
    if (!role)
      throw new NotFoundException(
        `Role with id ${createUserDto.roleId} not found`,
      );

    const department = await this.departmentService.getDepartmentById(
      createUserDto.departmentId,
    );
    if (!department)
      throw new NotFoundException(
        `Department with id ${createUserDto.departmentId} not found`,
      );

    await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        ...createUserDto,
        password: hashedPassword,
        role,
        department,
      })
      .execute();

    return { message: 'User created successfully' };
  }

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
