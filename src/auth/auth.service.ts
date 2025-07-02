/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service'; // Import UsersService
import { LoginDto } from './dtos/login.dto'; // Your DTO to receive login info
import { JwtPayload } from './interfaces/jwt-payload.interface'; // JWT Payload Interface

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService, // Inject UsersService
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username); // Adjust this method
    if (user && user.password === password) {
      // Normally use bcrypt to compare hashed password
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return {
      access_token: accessToken,
    };
  }
}
