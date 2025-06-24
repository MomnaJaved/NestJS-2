import { Controller, Get, Post, Body } from '@nestjs/common';

interface User {
  id: string;
  name: string;
}

@Controller('users')
export class UserController {
  private users: User[] = [];

  @Get()
  getAllUsers() {
    return this.users;
  }

  @Post()
  createUser(@Body() user: User) {
    if (!user.id || !user.name) {
      return { message: 'Invalid user data. id and name are required.' };
    }
    this.users.push(user);
    return { message: 'User created', user };
  }
}
