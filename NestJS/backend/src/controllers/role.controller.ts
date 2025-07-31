import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'; // Import Swagger decorators
import { RoleService } from '../services/role.service';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { Roles } from '../decorators/role.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { RoleGuard } from '../guards/role.guard';
import { UpdateRoleDto } from '../dtos/update-role.dto';

@ApiTags('Roles') // Tagging all routes in this controller under the 'roles' category
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new role' }) // Describes the operation
  @ApiBody({ type: CreateRoleDto }) // Specifies the body structure for creating a role
  @ApiResponse({ status: 201, description: 'Role successfully created.' }) // Success response
  @ApiResponse({ status: 400, description: 'Invalid role data provided.' }) // Failure response
  async createRole(@Body() roleDto: CreateRoleDto) {
    return this.roleService.createRole(roleDto);
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all roles' }) // Describes the operation
  @ApiResponse({
    status: 200,
    description: 'List of roles retrieved successfully.',
  }) // Success response
  @ApiResponse({
    status: 403,
    description: 'Forbidden, only admins can access this route.',
  }) // Unauthorized access
  getRoles() {
    return this.roleService.getRoles();
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a role by ID' }) // Describes the operation
  @ApiParam({ name: 'id', description: 'Role ID to update' }) // Describes the 'id' parameter
  @ApiBody({ type: UpdateRoleDto }) // Specifies the body structure for updating a role
  @ApiResponse({ status: 200, description: 'Role updated successfully.' }) // Success response
  @ApiResponse({ status: 400, description: 'Invalid role data provided.' }) // Failure response
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.updateRole(Number(id), dto);
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a role by ID' }) // Describes the operation
  @ApiParam({ name: 'id', description: 'Role ID to delete' }) // Describes the 'id' parameter
  @ApiResponse({ status: 200, description: 'Role deleted successfully.' }) // Success response
  @ApiResponse({ status: 404, description: 'Role not found.' }) // Failure response if role not found
  async deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(Number(id));
  }
}
