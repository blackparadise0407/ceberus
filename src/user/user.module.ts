import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttachmentModule } from '@/attachment/attachment.module';

import { Profile } from './profile/profile.entity';
import { ProfileRepository } from './profile/profile.repository';
import { ProfileService } from './profile/profile.service';
import { UserFollower } from './user-follower/user-follower.entity';
import { UserFollowerRepository } from './user-follower/user-follower.repository';
import { UserFollowerService } from './user-follower/user-follower.service';
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
      UserFollower,
      UserFollowerRepository,
    ]),
    forwardRef(() => AttachmentModule),
  ],
  providers: [UserResolver, UserService, ProfileService, UserFollowerService],
  exports: [UserService],
})
export class UserModule {}
