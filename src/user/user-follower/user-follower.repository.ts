import { EntityRepository, Repository } from 'typeorm';

import { mapRawQueryToEntities } from '@/helpers/typeorm';

import { TopFollowedUser } from '../dto/top-followed-user.output';
import { UserFollower } from './user-follower.entity';

@EntityRepository(UserFollower)
export class UserFollowerRepository extends Repository<UserFollower> {
  public findFollowersByUserId(userId: string) {
    return this.createQueryBuilder('userFollower')
      .where('userFollower.user_id = :userId', { userId })
      .leftJoinAndMapOne('userFollower.user', 'userFollower.follower', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .getMany();
  }

  public findFollowingByUserId(userId: string) {
    return this.createQueryBuilder('userFollower')
      .where('userFollower.follower_id = :userId', { userId })
      .leftJoinAndSelect('userFollower.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .getMany();
  }

  public async findTopFollowedUsers() {
    // RAW QUERY select u.*, count(uf.user_id) from user_follower uf left join "user" u on uf.user_id=u.id group by u.id order by uf.count DESC limit 10;
    const result = await this.createQueryBuilder('userFollower')
      .select('COUNT(userFollower.user_id)', 'count')
      .leftJoinAndSelect('userFollower.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .groupBy('user.id')
      .addGroupBy('profile.id')
      .orderBy('"userFollower"."count"', 'DESC')
      .limit(2)
      .getRawMany();
    console.log(result);
    return mapRawQueryToEntities<TopFollowedUser>(result, ['count']);
  }
}
