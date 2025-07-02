import { Controller, Post, Body, Get } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dtos/create-attendance.dto';
import { Attendance } from './attendance.entity';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  async createAttendance(
    @Body() createAttendanceDto: CreateAttendanceDto,
  ): Promise<Attendance> {
    return this.attendanceService.createAttendance(createAttendanceDto);
  }

  @Get()
  async getAttendance(): Promise<Attendance[]> {
    return this.attendanceService.getAttendance();
  }
}
