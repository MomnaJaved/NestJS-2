import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async createUser(UserDto: CreateUserDto) {
    //if a user exits already, then do not create it
    const user = await this.userRepository.findOne({
      where: { email: UserDto.email },
    });
    //handle the error
    if (user) {
      return 'The user already exits';
    }
    //create user
    const newUser = this.userRepository.create(UserDto);
    return this.userRepository.save(newUser);
  }

  getUsers() {
    return this.userRepository.find();
  }
}
