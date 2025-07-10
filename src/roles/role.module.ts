import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    JwtModule.register({
      secret: 'mySuperSecretKey12345',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService, TypeOrmModule],
})
export class RoleModule {}
