import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginDto } from '../dtos/login.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User Signup' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created and email sent for confirmation.',
  })
  @ApiResponse({
    status: 409,
    description: 'The user already exists with the given email.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request (e.g., invalid data in the signup request).',
  })
  async signup(@Body() signupDto: CreateUserDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in and JWT token issued.',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - Invalid credentials (email or password incorrect).',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request (e.g., missing or invalid email/password in the login request).',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
