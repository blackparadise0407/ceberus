import { EntityRepository, Repository } from 'typeorm';

import { UserFollower } from './user-follower.entity';

@EntityRepository(UserFollower)
export class UserFollowerRepository extends Repository<UserFollower> {
  public findFollowersByUserId(userId: string) {
    return this.createQueryBuilder('userFollower')
      .where('userFollower.user_id = :userId', { userId })
      .leftJoinAndMapOne('userFollower.user', 'userFollower.follower', 'user')
      .getMany();
  }

  public findFollowingByUserId(userId: string) {
    return this.createQueryBuilder('userFollower')
      .where('userFollower.follower_id = :userId', { userId })
      .leftJoinAndSelect('userFollower.user', 'user')
      .getMany();
  }
}
