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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { Roles } from './role.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { RoleGuard } from '../guards/role.guard';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Post()
  async createRole(@Body() roleDto: CreateRoleDto) {
    return this.roleService.createRole(roleDto);
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  getRoles() {
    return this.roleService.getRoles();
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Patch(':id')
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.updateRole(Number(id), dto);
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(Number(id));
  }
}
