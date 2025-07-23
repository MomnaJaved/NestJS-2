import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'; // Import Swagger decorators
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dtos/create-subject.dto';
import { RegisterSubjectDto } from './dtos/register-subject.dto';
import { Roles } from '../roles/role.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { RoleGuard } from '../guards/role.guard';
import { UpdateSubjectDto } from './dtos/update-subject.dto';

@ApiTags('Subjects') // Tagging all routes in this controller under the 'subjects' category
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post('register')
  @Roles('Student', 'admin')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a student to a subject' })
  @ApiBody({ type: RegisterSubjectDto }) // Request body to register student
  @ApiResponse({
    status: 201,
    description: 'Student registered to subject successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid student or subject ID.' })
  async registerStudentToSubject(@Body() dto: RegisterSubjectDto) {
    const registration = await this.subjectsService.registerStudentToSubject(
      dto.studentId,
      dto.subjectId,
    );

    // Update faculty-student relations after registration
    await this.subjectsService.updateStudentFacultyRelations(dto.subjectId);

    return registration;
  }

  @Post()
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new subject' })
  @ApiBody({ type: CreateSubjectDto }) // Request body to create subject
  @ApiResponse({ status: 201, description: 'Subject created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid subject data.' })
  async create(@Body() dto: CreateSubjectDto) {
    return this.subjectsService.createSubject(dto.name);
  }

  @Get()
  @Roles('Student', 'admin')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all subjects' })
  @ApiResponse({ status: 200, description: 'List of all subjects.' })
  async findAll() {
    return this.subjectsService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a subject by ID' })
  @ApiParam({ name: 'id', description: 'Subject ID to find the subject' })
  @ApiResponse({ status: 200, description: 'Subject details.' })
  @ApiResponse({ status: 404, description: 'Subject not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.findById(id);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a subject by ID' })
  @ApiParam({ name: 'id', description: 'Subject ID to delete' })
  @ApiResponse({ status: 200, description: 'Subject deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Subject not found.' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.deleteSubject(id);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a subject by ID' })
  @ApiParam({ name: 'id', description: 'Subject ID to update' })
  @ApiBody({ type: UpdateSubjectDto }) // Request body to update subject
  @ApiResponse({ status: 200, description: 'Subject updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid subject data.' })
  async updateSubject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubjectDto,
  ) {
    return this.subjectsService.updateSubject(id, dto);
  }
}
