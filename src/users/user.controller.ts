import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service'; // Corrected the import for UserService
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { RoleGuard } from '../guards/role.guard'; // Import the role guard
import { SetMetadata } from '@nestjs/common'; // Corrected the import for SetMetadata

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {} // Added constructor to inject userService

  // Create user
  @Post()
  @SetMetadata('roles', ['admin']) // Only users with 'admin' role can access this route
  @UseGuards(RoleGuard)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // Get all users
  @Get()
  @SetMetadata('roles', ['admin']) // Only users with 'admin' role can access this route
  @UseGuards(RoleGuard)
  getUsers() {
    return this.userService.getUsers(); // Corrected the typo: userServic -> userService
  }

  // Update user by ID
  @Put(':id')
  @SetMetadata('roles', ['admin']) // Only users with 'admin' role can access this route
  @UseGuards(RoleGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  // Delete user by ID
  @Delete(':id')
  @SetMetadata('roles', ['admin']) // Only users with 'admin' role can access this route
  @UseGuards(RoleGuard)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
