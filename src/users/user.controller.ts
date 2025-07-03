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
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { RoleGuard } from '../guards/role.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { Roles } from '../roles/role.decorator';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {} // Added constructor to inject userService

  // Create user
  @Post()
  // Only users with 'admin' role can access this route
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // Get all users
  @Get()
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard) // Only users with 'admin' role can access this route
  getUsers() {
    return this.userService.getUsers();
  }

  // Update user by ID
  @Put(':id')
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  // Delete user by ID
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
