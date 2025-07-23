import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dtos/mark-attendance.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../roles/role.decorator';
import { RolesOrOwnerFacultyGuard } from '../guards/roles-owner.guard';
import { FacultySubjectAccessGuard } from '../guards/faculty-subjects.guard';
import { FacultyAssignedToSubjectGuard } from '../guards/facultyAssignedtoSubject.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateAttendanceDto } from './dtos/update-attendance.dto';

@ApiTags('Attendance') // Adds a tag for all routes in this controller
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(JwtGuard, RoleGuard, FacultyAssignedToSubjectGuard)
  @Post('mark')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark attendance for a student in a subject' })
  @ApiBody({ type: MarkAttendanceDto }) // Defines the body of the request
  @ApiResponse({ status: 200, description: 'Attendance marked successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or missing permissions.',
  })
  markAttendance(@Body() dto: MarkAttendanceDto) {
    return this.attendanceService.markAttendance(
      dto.studentId,
      dto.subjectId,
      dto.status,
    );
  }

  @Get('student/:studentId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get attendance for a student' })
  @ApiParam({ name: 'studentId', description: 'The ID of the student' })
  @ApiResponse({ status: 200, description: 'Attendance data for the student.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Student can only view their own attendance.',
  })
  @UseGuards(JwtGuard, RolesOrOwnerFacultyGuard)
  async getAttendanceForStudent(@Param('studentId') studentId: string) {
    return this.attendanceService.getStudentAttendanceDetails(studentId);
  }

  @Get('viewAttendance/:subjectId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'View all attendance for a subject' })
  @ApiParam({ name: 'subjectId', description: 'The ID of the subject' })
  @ApiResponse({ status: 200, description: 'Attendance data for the subject.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Faculty cannot access unauthorized subjects.',
  })
  @UseGuards(JwtGuard, FacultySubjectAccessGuard)
  async viewAllAttendanceDetails(@Param('subjectId') subjectId: number) {
    return this.attendanceService.viewAllAttendance(subjectId);
  }

  @Get(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an attendance record by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the attendance record' })
  @ApiResponse({ status: 200, description: 'Attendance record found.' })
  @ApiResponse({ status: 404, description: 'Attendance record not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Unauthorized access.' })
  @UseGuards(JwtGuard, RoleGuard)
  async getAttendanceRecordById(@Param('id') id: number) {
    return this.attendanceService.getAttendanceRecordById(id);
  }
  @Put(':id')
  @Roles('Faculty', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update attendance for a student in a subject' })
  @ApiParam({ name: 'id', description: 'Attendance record ID' })
  @ApiBody({ type: UpdateAttendanceDto })
  @ApiResponse({ status: 200, description: 'Attendance updated successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or missing permissions.',
  })
  @UseGuards(JwtGuard, RoleGuard)
  async updateAttendance(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.updateAttendance(id, dto.status);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an attendance record' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the attendance record to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Attendance record deleted successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid ID or record not found.' })
  @UseGuards(JwtGuard, RoleGuard)
  async deleteAttendance(
    @Param('id') id: number, // Only the attendance record ID from the URL is needed
  ) {
    return this.attendanceService.deleteAttendance(id); // Call service to delete record
  }
}
