import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // Assuming you have a DTO for updating users

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create user
  public async createUser(UserDto: CreateUserDto) {
    // Check if the user already exists by email
    const existingUser = await this.userRepository.findOne({
      where: { email: UserDto.email },
    });

    // If user exists, throw a ConflictException
    if (existingUser) {
      throw new ConflictException('The user already exists');
    }

    // Create a new user object and save it to the database
    const newUser = this.userRepository.create(UserDto);
    return this.userRepository.save(newUser);
  }

  // Method to retrieve all users
  public getUsers() {
    return this.userRepository.find();
  }

  // Method to update a user by id
  public async updateUser(id: string, updateUserDto: UpdateUserDto) {
    // Find the user by ID
    const user = await this.userRepository.findOne({ where: { id } });

    // If the user doesn't exist, throw NotFoundException
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Update the user with the new data
    Object.assign(user, updateUserDto);

    // Save the updated user
    return this.userRepository.save(user);
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
