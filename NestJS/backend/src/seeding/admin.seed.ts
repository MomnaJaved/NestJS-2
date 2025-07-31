import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Department } from '../entities/department.entity';
import { getEnvVarOrThrow } from '../common/env.helper';
import { ADMIN_ROLE_NAME, ADMIN_DEPARTMENT_NAME } from '../common/constants';
@Injectable()
export class AdminSeed {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async run(): Promise<void> {
    // Check/Create Role
    let adminRole = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.name = :name', { name: ADMIN_ROLE_NAME })
      .getOne();

    if (!adminRole) {
      const insertResult = await this.roleRepository
        .createQueryBuilder()
        .insert()
        .into(Role)
        .values({
          name: ADMIN_ROLE_NAME,
          description: 'Administrator with full access',
        })
        .execute();

      adminRole = await this.roleRepository.findOneBy({
        id: insertResult.identifiers[0].id,
      });
    }

    if (!adminRole) throw new Error('Failed to create or retrieve admin role');

    // Check for existing admin user
    const existingAdmin = await this.userRepository.findOne({
      where: { email: process.env.DEFAULT_ADMIN_EMAIL },
    });

    if (existingAdmin) {
      console.log(' Admin user already exists!');
      return;
    }

    // Check/Create Department
    let department = await this.departmentRepository
      .createQueryBuilder('department')
      .where('department.name = :name', { name: ADMIN_DEPARTMENT_NAME })
      .getOne();

    if (!department) {
      const insertResult = await this.departmentRepository
        .createQueryBuilder()
        .insert()
        .into(Department)
        .values({
          name: ADMIN_DEPARTMENT_NAME,
          description: 'Admin Department',
        })
        .execute();

      department = await this.departmentRepository.findOneBy({
        id: insertResult.identifiers[0].id,
      });
    }

    if (!department) throw new Error('Failed to create or retrieve department');

    const password = getEnvVarOrThrow('DEFAULT_ADMIN_PASSWORD');
    const hashedPassword = await bcrypt.hash(password, 10);

    //Insert admin user
    await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        firstName: 'Jalal',
        lastName: 'Junaid',
        password: hashedPassword,
        contact: '03123456789',
        email: process.env.DEFAULT_ADMIN_EMAIL,
        status: true,
        code: 'EMP001',
        gender: 'Male',
        DOB: new Date('1990-01-01'),
        maritalStatus: 'Single',
        CNIC: '1234567890123',
        designation: ADMIN_ROLE_NAME,
        joiningDate: new Date('2020-01-01'),
        probationPeriod: '6 months',
        program: 'Admin Program',
        role: adminRole,
        department: department,
      })
      .execute();

    console.log('Admin user created successfully!');
    console.log('Seeding admin with role:', adminRole.name);
  }
}
