import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { Department } from './department.entity';
import { Roles } from '../roles/role.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { RoleGuard } from '../guards/role.guard';
import { UpdateDepartmentDto } from './dtos/update-department.dto';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Post('createDepartment')
  async createDepartment(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    return this.departmentService.createDepartment(createDepartmentDto);
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Get('viewDepartments')
  async getAllDepartments(): Promise<Department[]> {
    return this.departmentService.getAllDepartments();
  }

  @Get('viewDepartment/:id')
  async getDepartmentById(@Param('id') id: string): Promise<Department> {
    return this.departmentService.getDepartmentById(id);
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('update/:id')
  async updateDepartment(
    @Param('id') id: string,
    @Body() updateDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.departmentService.updateDepartment(id, updateDto);
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Delete('delete/:id')
  async deleteDepartment(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.departmentService.deleteDepartment(id);
  }
}
