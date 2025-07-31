// src/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from '../services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UserService) {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) {
      throw new Error('JWT_SECRET_KEY environment variable is not set');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const { email, sub } = payload;
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    // Here we don't need to check for role
    return {
      id: user.id,
      email: user.email,
    };
  }
}

// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { Strategy } from 'passport-jwt';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt } from 'passport-jwt';
// import { JwtPayload } from '../interfaces/jwt-payload.interface';
// import { UserService } from '../services/user.service';
// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private readonly usersService: UserService) {
//     const secret = process.env.JWT_SECRET_KEY;
//     if (!secret) {
//       throw new Error('JWT_SECRET_KEY environment variable is not set');
//     }

//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: secret,
//     });
//   }

//   async validate(payload: JwtPayload) {
//     const { email, role } = payload;
//     const user = await this.usersService.findOneByEmail(email);

//     if (!user) {
//       throw new UnauthorizedException();
//     }

//     return {
//       id: user.id,
//       email: user.email,
//       role: role,
//     };
//   }
// }
