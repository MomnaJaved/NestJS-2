import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service'; // Import the AttendanceService
import { MarkAttendanceDto } from './dtos/mark-attendance.dto';
import { JwtGuard } from '../guards/jwt.guard'; // Import the JwtGuard for authentication
import { RoleGuard } from '../guards/role.guard'; // Import the RoleGuard for authorization (admin or faculty)
import { Roles } from '../roles/role.decorator'; // Custom decorator to set roles
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { RolesOrOwnerFacultyGuard } from '../guards/roles-owner.guard';
import { FacultySubjectAccessGuard } from '../guards/faculty-subjects.guard';
import { FacultyAssignedToSubjectGuard } from '../guards/faculty-subject.guard';
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(JwtGuard, RoleGuard, FacultyAssignedToSubjectGuard)
  @Post('mark')
  markAttendance(@Body() dto: MarkAttendanceDto) {
    return this.attendanceService.markAttendance(
      dto.studentId,
      dto.subjectId,
      dto.status,
    );
  }

  @UseInterceptors(LoggingInterceptor)
  @Get('student/:studentId')
  //only the student himself should be able to view his attendance, faculty and admin can also view it.
  @UseGuards(JwtGuard, RolesOrOwnerFacultyGuard)
  async getAttendanceForStudent(@Param('studentId') studentId: string) {
    return this.attendanceService.getStudentAttendanceDetails(studentId);
  }

  //view subject attendance
  @Get('viewAttendance/:subjectId')
  @Roles('Faculty')
  @UseGuards(JwtGuard, RoleGuard, FacultySubjectAccessGuard)
  async viewAllAttendanceDetails(@Param('subjectId') subjectId: number) {
    return this.attendanceService.viewAllAttendance(subjectId);
  }

  @Put(':id')
  @Roles('Faculty', 'admin')
  @UseGuards(JwtGuard, RoleGuard, FacultySubjectAccessGuard)
  async updateAttendance(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MarkAttendanceDto,
  ) {
    return this.attendanceService.updateAttendance(id, dto.status);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard, FacultySubjectAccessGuard)
  async deleteAttendance(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.deleteAttendance(id);
  }
}
