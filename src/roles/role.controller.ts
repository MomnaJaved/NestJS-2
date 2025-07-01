import { Controller, Post, Body, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos/create-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // POST endpoint to create a role
  @Post()
  async createRole(@Body() roleDto: CreateRoleDto) {
    return this.roleService.createRole(roleDto);
  }

  // GET endpoint to fetch all roles
  @Get()
  getRoles() {
    return this.roleService.getRoles();
  }
}
