import { Injectable } from '@nestjs/common';

import { BaseService } from '@/common/services/base.service';

import { Tag } from './tag.entity';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService extends BaseService<Tag, TagRepository> {
  constructor(private readonly tagRepo: TagRepository) {
    super(tagRepo);
  }
}
