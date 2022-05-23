import { EntityRepository, Repository } from 'typeorm';

import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByUsernameOrEmail(str: string) {
    return this.createQueryBuilder('user')
      .where('user.email = :email', { email: str })
      .orWhere('user.username = :username', { username: str })
      .getOne();
  }
}
