import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Profile } from './profile/profile.entity';
import { ProfileRepository } from './profile/profile.repository';
import { ProfileService } from './profile/profile.service';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRepository,
      Profile,
      ProfileRepository,
    ]),
  ],
  providers: [UserResolver, UserService, ProfileService],
  exports: [UserService],
})
export class UserModule {}
