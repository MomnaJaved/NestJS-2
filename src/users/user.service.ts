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
  public async createUser(createUserDto: CreateUserDto) {
    // Check if the user already exists by email
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('The user already exists');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword; // Assign the hashed password to the DTO

    // Fetch the role by roleId (ensure roleId is treated as an integer)
    const role = await this.roleService.findRoleById(createUserDto.roleId);
    if (!role) {
      throw new NotFoundException(
        `Role with id ${createUserDto.roleId} not found`,
      );
    }

    // Fetch the department by departmentId
    const department = await this.departmentService.findDepartmentById(
      createUserDto.departmentId,
    );
    if (!department) {
      throw new NotFoundException(
        `Department with id ${createUserDto.departmentId} not found`,
      );
    }

    // Create the user and associate the role and department
    const newUser = this.userRepository.create({
      ...createUserDto,
      role, // Associate the role object
      department, // Associate the department object
    });

    // Save the new user to the database
    return this.userRepository.save(newUser);
  }

  // Method to update a user's information
  public async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // If the password is provided, hash it before saving
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword; // Assign the hashed password
    }

    // If provided, update the role
    if (updateUserDto.roleId) {
      const role = await this.roleService.findRoleById(updateUserDto.roleId);
      if (!role) {
        throw new NotFoundException(
          `Role with id ${updateUserDto.roleId} not found`,
        );
      }
      user.role = role; // Associate the new role
    }

    // If provided, update the department
    if (updateUserDto.departmentId) {
      const department = await this.departmentService.findDepartmentById(
        updateUserDto.departmentId,
      );
      if (!department) {
        throw new NotFoundException(
          `Department with id ${updateUserDto.departmentId} not found`,
        );
      }
      user.department = department; // Associate the new department
    }

    // Update other fields of the user
    Object.assign(user, updateUserDto);

    // Save the updated user
    return this.userRepository.save(user);
  }

  // Method to find user by email
  public async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role', 'department'], // Include role and department in the result
    });
  }

  // Method to delete a user by id
  public async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.delete(id);

    return { message: `User with id ${id} has been deleted` };
  }

  // Method to retrieve all users
  public getUsers() {
    return this.userRepository.find({
      relations: ['role', 'department'], // Include related role and department
    });
  }
}
