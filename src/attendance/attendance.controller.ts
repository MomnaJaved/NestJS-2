import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service'; // Import the AttendanceService
import { JwtGuard } from '../guards/jwt.guard'; // Import the JwtGuard for authentication
import { RoleGuard } from '../guards/role.guard'; // Import the RoleGuard for authorization (admin or faculty)
import { Roles } from '../roles/role.decorator'; // Custom decorator to set roles
import { CreateAttendanceDto } from './dtos/create-attendance.dto'; // DTO for creating attendance

@Controller('attendance') // Define the base route for the controller
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Mark attendance for students
  @Post('mark') // Endpoint for marking attendance
  @Roles('Faculty') // Only users with the 'faculty' role can access this route
  @UseGuards(JwtGuard, RoleGuard) // Protect the route with JWT authentication and role-based authorization
  async markAttendance(@Body() createAttendanceDto: CreateAttendanceDto) {
    const { subjectId, studentIds, status } = createAttendanceDto; // Destructure the data from the request body
    return this.attendanceService.markAttendance(subjectId, studentIds, status); // Call the service to mark the attendance
  }
}
