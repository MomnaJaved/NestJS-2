import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { LoginDto } from './dtos/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate user with bcrypt comparison
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Use bcrypt.compare to validate the password (hashed password comparison)
      return user;
    }
    return null;
  }

  // Login logic
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token with user information
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role.name,
    };

    // Get secret directly from environment variables
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      throw new UnauthorizedException(
        'JWT secret key not set in environment variables',
      );
    }

    const accessToken = this.jwtService.sign(payload, {
      secret,
    });

    return {
      access_token: accessToken,
    };
  }
}
