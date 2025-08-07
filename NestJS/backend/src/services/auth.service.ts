import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from './emailService';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
//auth service
@Injectable()
export class AuthService {
  constructor(
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Signup method
  public async signup(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { CNIC: createUserDto.CNIC }],
    });

    if (existingUser) {
      throw new ConflictException('The user already exists');
    }

    const unhashedPassword = createUserDto.password;
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.userRepository.insert(newUser);

    await this.emailService.sendEmail(
      newUser.email,
      newUser.firstName,
      unhashedPassword,
    );

    return { message: 'User created successfully' };
  }

  // Login method
  public async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {
      // Fetch the user
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email'); // Custom message for incorrect email
      }

      // Check if the password matches
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect password'); // Custom message for incorrect password
      }

      // Generate JWT token (without role)
      const payload: JwtPayload = {
        email: user.email,
        sub: user.id, // This is the user ID that will be used as the 'sub' claim
      };

      const accessToken = this.jwtService.sign(payload); // Sign the payload to create a JWT token

      return { access_token: accessToken };
    } catch (error) {
      console.error(error);

      // Check if the error is due to a specific issue (email or password)
      if (error instanceof UnauthorizedException) {
        throw error; // Re-throw the UnauthorizedException to preserve the specific error message
      }

      // For any other error, return a more generic message
      throw new UnauthorizedException(
        'Something went wrong. Please try again later.',
      );
    }
  }
}
