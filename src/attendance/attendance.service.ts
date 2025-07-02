import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { CreateAttendanceDto } from './dtos/create-attendance.dto';
import { User } from '../users/user.entity';
import { Department } from '../departments/department.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  // Create new attendance entry
  async createAttendance(createAttendanceDto: CreateAttendanceDto) {
    const user = await this.userRepository.findOne({
      where: { id: createAttendanceDto.userId }, // Ensure `userId` is the correct UUID
    });
    if (!user) {
      throw new NotFoundException(
        `User with id ${createAttendanceDto.userId} not found`,
      );
    }

    const department = await this.departmentRepository.findOne({
      where: { id: createAttendanceDto.departmentId }, // Ensure `departmentId` is the correct UUID
    });
    if (!department) {
      throw new NotFoundException(
        `Department with id ${createAttendanceDto.departmentId} not found`,
      );
    }

    const attendance = this.attendanceRepository.create(createAttendanceDto);
    return await this.attendanceRepository.save(attendance);
  }

  // Get all attendance records
  async getAttendance() {
    return this.attendanceRepository.find({
      relations: ['user', 'department'], // Ensure user and department relations are loaded
    });
  }
}
