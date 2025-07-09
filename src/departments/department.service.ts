import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { UpdateDepartmentDto } from './dtos/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  // Create department
  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    const department = this.departmentRepository.create(createDepartmentDto);
    return this.departmentRepository.save(department);
  }

  // Get all departments
  async getAllDepartments(): Promise<Department[]> {
    return this.departmentRepository.find();
  }

  // Get department by ID
  async getDepartmentById(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  async updateDepartment(
    id: string,
    updateDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.getDepartmentById(id);
    Object.assign(department, updateDto);
    return this.departmentRepository.save(department);
  }

  async deleteDepartment(id: string): Promise<{ message: string }> {
    const department = await this.getDepartmentById(id);
    await this.departmentRepository.remove(department);
    return { message: `Department with ID ${id} deleted successfully` };
  }
}
