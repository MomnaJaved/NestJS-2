import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../users/user.service'; // Inject UsersService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'mySuperSecretKey12345', // Use the same key used in the AuthModule
    });
  }

  async validate(payload: JwtPayload) {
    const { username } = payload;
    const user = await this.usersService.findOneByEmail(username); // Find user by username
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
