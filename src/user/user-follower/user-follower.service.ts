import { Injectable } from '@nestjs/common';

import { BaseService } from '@/common/services/base.service';

import { UserFollower } from './user-follower.entity';
import { UserFollowerRepository } from './user-follower.repository';

@Injectable()
export class UserFollowerService extends BaseService<
  UserFollower,
  UserFollowerRepository
> {
  constructor(private readonly userFollowerRepo: UserFollowerRepository) {
    super(userFollowerRepo);
  }
}
