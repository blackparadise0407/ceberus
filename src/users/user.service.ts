import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseService } from '@/common/services/base.service';

import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends BaseService<User, UserRepository> {
  constructor(@InjectRepository(User) userRepo: UserRepository) {
    super(userRepo);
  }
}
