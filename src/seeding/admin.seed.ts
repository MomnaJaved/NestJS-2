import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { Department } from '../departments/department.entity';

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

  async run() {
    // Check if the admin role exists, if not, create it
    let adminRole = await this.roleRepository.findOne({
      where: { name: 'admin' },
    });

    if (!adminRole) {
      adminRole = await this.roleRepository.save({
        name: 'admin',
        description: 'Administrator with full access',
      });
    }

    // Check if admin user already exists
    const existingAdmin = await this.userRepository.findOne({
      where: { email: 'javediqbal@gmail.com' }, // Change this to your desired email
    });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }

    // Check if department exists
    let department = await this.departmentRepository.findOne({
      where: { name: 'Administration' },
    });

    if (!department) {
      department = await this.departmentRepository.save({
        name: 'Administration',
        description: 'Admin Department',
      });
    }

    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const newAdmin = this.userRepository.create({
      firstName: 'Javed',
      lastName: 'Iqbal',
      password: hashedPassword,
      email: 'javediqbal@gmail.com',
      status: true,
      code: 'EMP001',
      gender: 'Male',
      DOB: new Date('1990-01-01'),
      maritalStatus: 'Single',
      CNIC: '1234567890123',
      program: 'Admin Program',
      joiningDate: new Date('2020-01-01'),
      programDuration: '2 years',
      role: adminRole,
      department: department,
    });

    // Save the new admin user
    await this.userRepository.save(newAdmin);
    console.log('Admin user created!');
  }
}
