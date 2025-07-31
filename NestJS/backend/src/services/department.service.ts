import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import { CreateDepartmentDto } from '../dtos/create-department.dto';
import { UpdateDepartmentDto } from '../dtos/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  // Create department using insert
  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<Department> {
    const insertResult = await this.departmentRepository
      .createQueryBuilder()
      .insert()
      .into(Department)
      .values(createDepartmentDto)
      .execute();

    const insertedId = insertResult.identifiers[0].id;
    return this.getDepartmentById(insertedId);
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

  // Update department
  async updateDepartment(
    id: string,
    updateDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const updateResult = await this.departmentRepository
      .createQueryBuilder()
      .update(Department)
      .set(updateDto)
      .where('id = :id', { id })
      .execute();

    if (updateResult.affected === 0) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return this.getDepartmentById(id);
  }

  // Delete department
  async deleteDepartment(id: string): Promise<{ message: string }> {
    const deleteResult = await this.departmentRepository
      .createQueryBuilder()
      .delete()
      .from(Department)
      .where('id = :id', { id })
      .execute();

    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return { message: `Department with ID ${id} deleted successfully` };
  }
}
