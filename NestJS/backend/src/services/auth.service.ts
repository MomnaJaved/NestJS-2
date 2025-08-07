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
import { EventEmitter2 } from '@nestjs/event-emitter'; // Import EventEmitter

@Injectable()
export class AuthService {
  constructor(
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2, // Inject EventEmitter
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

    // Emit 'user.signedUp' event
    this.eventEmitter.emit('user.signedUp', {
      email: newUser.email,
      firstName: newUser.firstName,
      password: unhashedPassword,
    });

    return { message: 'User created successfully' };
  }

  // Login method
  public async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect password');
      }

      const payload: JwtPayload = {
        email: user.email,
        sub: user.id,
      };

      const accessToken = this.jwtService.sign(payload);

      // Emit 'user.loggedIn' event
      this.eventEmitter.emit('user.loggedIn', {
        email: user.email,
      });

      return { access_token: accessToken };
    } catch (error) {
      console.error(error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException(
        'Something went wrong. Please try again later.',
      );
    }
  }
}
