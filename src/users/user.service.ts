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
import { RoleService } from '../roles/role.service'; // Import RoleService
import { DepartmentService } from '../departments/department.service'; // Import DepartmentService

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService, // Inject RoleService
    private readonly departmentService: DepartmentService, // Inject DepartmentService
  ) {}

  // Create user
  public async createUser(createUserDto: CreateUserDto) {
    // Check if the user already exists by email
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    // If user exists, throw a ConflictException
    if (existingUser) {
      throw new ConflictException('The user already exists');
    }

    // Find the role by roleId using RoleService
    const role = await this.roleService.findRoleById(createUserDto.roleId); // Delegate to RoleService
    if (!role) {
      throw new NotFoundException(
        `Role with id ${createUserDto.roleId} not found`,
      );
    }

    // Find the department by departmentId using DepartmentService
    const department = await this.departmentService.findDepartmentById(
      createUserDto.departmentId,
    ); // Delegate to DepartmentService
    if (!department) {
      throw new NotFoundException(
        `Department with id ${createUserDto.departmentId} not found`,
      );
    }

    // Create a new user object and associate the role and department
    const newUser = this.userRepository.create(createUserDto);
    newUser.role = role; // Associate the role object
    newUser.department = department; // Associate the department object

    // Save the new user to the database
    return this.userRepository.save(newUser);
  }

  // Method to retrieve all users
  public getUsers() {
    return this.userRepository.find({
      relations: ['role', 'department'], // Include role and department in the result
    });
  }

  // Method to update a user by id
  public async updateUser(id: string, updateUserDto: UpdateUserDto) {
    // Find the user by ID
    const user = await this.userRepository.findOne({ where: { id } });

    // If the user doesn't exist, throw NotFoundException
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Update the user's role if provided using RoleService
    if (updateUserDto.roleId) {
      const role = await this.roleService.findRoleById(updateUserDto.roleId); // Delegate to RoleService
      if (!role) {
        throw new NotFoundException(
          `Role with id ${updateUserDto.roleId} not found`,
        );
      }
      user.role = role; // Associate the new role
    }

    // Update the user's department if provided using DepartmentService
    if (updateUserDto.departmentId) {
      const department = await this.departmentService.findDepartmentById(
        updateUserDto.departmentId,
      ); // Delegate to DepartmentService
      if (!department) {
        throw new NotFoundException(
          `Department with id ${updateUserDto.departmentId} not found`,
        );
      }
      user.department = department; // Associate the new department
    }

    // Update the other fields of the user
    Object.assign(user, updateUserDto);

    // Save the updated user
    return this.userRepository.save(user);
  }

  // Method to find user by email
  public async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  // Method to delete a user by id
  public async deleteUser(id: string) {
    // Find the user by ID
    const user = await this.userRepository.findOne({ where: { id } });

    // If the user doesn't exist, throw NotFoundException
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Delete the user
    await this.userRepository.delete(id);

    return { message: `User with id ${id} has been deleted` };
  }
}
