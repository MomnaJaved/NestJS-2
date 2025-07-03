/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as bcrypt from 'bcrypt'; // Import bcrypt
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service'; // Import UsersService
import { LoginDto } from './dtos/login.dto'; // Your DTO to receive login info
import { JwtPayload } from './interfaces/jwt-payload.interface'; // JWT Payload Interface
import { ConfigService } from '@nestjs/config'; // Import ConfigService

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService, // Inject UsersService
    private readonly jwtService: JwtService, // Inject JwtService
    private readonly configService: ConfigService, // Inject ConfigService
  ) {}

  // Validate user with bcrypt comparison
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username); // Adjust this method
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
      username: user.email,
      sub: user.id,
      role: user.role, // Ensure `role` is included in the payload
    };

    const secret = this.configService.get<string>('JWT_SECRET_KEY'); // Get secret from environment variables

    const accessToken = this.jwtService.sign(payload, {
      secret, // Use the secret from the ConfigService
    });

    return {
      access_token: accessToken,
    };
  }
}
