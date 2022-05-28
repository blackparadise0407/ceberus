import { Injectable } from '@nestjs/common';

import { BaseService } from '@/common/services/base.service';

import { Profile } from './profile.entity';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService extends BaseService<Profile, ProfileRepository> {
  constructor(private readonly profileRepo: ProfileRepository) {
    super(profileRepo);
  }
}
