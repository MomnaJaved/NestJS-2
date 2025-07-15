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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'; // Import Swagger decorators
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { RoleGuard } from '../guards/role.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { Roles } from '../roles/role.decorator';

@ApiTags('users') // Tagging all routes in this controller under the 'users' category
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Create user
  @Post()
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user' }) // Describes the operation
  @ApiBody({ type: CreateUserDto }) // Specifies the body structure for creating a user
  @ApiResponse({ status: 201, description: 'User successfully created.' }) // Response on success
  @ApiResponse({ status: 400, description: 'Bad request due to invalid data.' }) // Response on failure
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // Get all users
  @Get()
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' }) // Describes the operation
  @ApiResponse({ status: 200, description: 'Retrieved list of users.' }) // Response on success
  @ApiResponse({
    status: 403,
    description: 'Forbidden, only admins can access this route.',
  }) // Response on unauthorized access
  getUsers() {
    return this.userService.getUsers();
  }

  // Update user by ID
  @Put(':id')
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user by ID' }) // Describes the operation
  @ApiParam({ name: 'id', description: 'User ID to update' }) // Describes the 'id' parameter
  @ApiBody({ type: UpdateUserDto }) // Specifies the body structure for updating a user
  @ApiResponse({ status: 200, description: 'User successfully updated.' }) // Response on success
  @ApiResponse({
    status: 400,
    description: 'Invalid data provided for user update.',
  }) // Response on failure
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by ID' }) // Describes the operation
  @ApiParam({ name: 'id', description: 'User ID to delete' }) // Describes the 'id' parameter
  @ApiResponse({ status: 200, description: 'User successfully deleted.' }) // Response on success
  @ApiResponse({ status: 404, description: 'User not found.' }) // Response on failure (user not found)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
