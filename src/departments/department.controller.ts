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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'; // Import Swagger decorators
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { Roles } from '../roles/role.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { RoleGuard } from '../guards/role.guard';
import { UpdateDepartmentDto } from './dtos/update-department.dto';

@ApiTags('departments') // Tagging all routes in this controller under the 'departments' category
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Roles('admin')
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RoleGuard)
  @Post('createDepartment')
  @ApiOperation({ summary: 'Create a new department' })
  @ApiBody({ type: CreateDepartmentDto }) // Specifies the body structure for creating a department
  @ApiResponse({ status: 201, description: 'Department successfully created.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid department data provided.',
  })
  async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.createDepartment(createDepartmentDto);
  }

  @Roles('admin')
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RoleGuard)
  @Get('viewDepartments')
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({ status: 200, description: 'List of all departments.' })
  async getAllDepartments() {
    return this.departmentService.getAllDepartments();
  }

  @Roles('admin')
  @Get('viewDepartment/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a department by ID' })
  @ApiParam({ name: 'id', description: 'Department ID to retrieve' }) // Describes the 'id' parameter
  @ApiResponse({ status: 200, description: 'Department details.' })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  async getDepartmentById(@Param('id') id: string) {
    return this.departmentService.getDepartmentById(id);
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('update/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a department by ID' })
  @ApiParam({ name: 'id', description: 'Department ID to update' })
  @ApiBody({ type: UpdateDepartmentDto }) // Specifies the body structure for updating a department
  @ApiResponse({ status: 200, description: 'Department successfully updated.' })
  @ApiResponse({ status: 400, description: 'Invalid department data.' })
  async updateDepartment(
    @Param('id') id: string,
    @Body() updateDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.updateDepartment(id, updateDto);
  }

  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Delete('delete/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a department by ID' })
  @ApiParam({ name: 'id', description: 'Department ID to delete' })
  @ApiResponse({ status: 200, description: 'Department successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  async deleteDepartment(@Param('id') id: string) {
    return this.departmentService.deleteDepartment(id);
  }
}
