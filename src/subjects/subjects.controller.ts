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
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dtos/create-subject.dto';
import { Subject } from './subjects.entity';
import { RegisterSubjectDto } from './dtos/register-subject.dto';
import { Roles } from '../roles/role.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { RoleGuard } from '../guards/role.guard';
import { UpdateSubjectDto } from './dtos/update-subject.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post('register')
  @Roles('Student', 'admin')
  @UseGuards(JwtGuard, RoleGuard)
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
  async create(@Body() dto: CreateSubjectDto): Promise<Subject> {
    return this.subjectsService.createSubject(dto.name);
  }

  @Get()
  @Roles('Student', 'admin')
  @UseGuards(JwtGuard, RoleGuard)
  async findAll(): Promise<Subject[]> {
    return this.subjectsService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Subject> {
    return this.subjectsService.findById(id);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.subjectsService.deleteSubject(id);
  }

  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  async updateSubject(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubjectDto,
  ): Promise<Subject> {
    return this.subjectsService.updateSubject(id, dto);
  }

  @Post(':id/update-relations')
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  async updateFacultyStudentRelations(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.subjectsService.updateStudentFacultyRelations(id);
  }
}
