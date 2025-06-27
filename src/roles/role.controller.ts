import { Controller, Post, Get, Body } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos/create-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(@Body() RoleDto: CreateRoleDto) {
    return this.roleService.createRole(RoleDto);
  }

  @Get()
  getRoles() {
    return this.roleService.getRoles();
  }
}
