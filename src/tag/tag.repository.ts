import { EntityRepository, Repository } from 'typeorm';

import { Tag } from './tag.entity';

@EntityRepository(Tag)
export class TagRepository extends Repository<Tag> {
  public findTagsByNameArr(tags: string[]) {
    return this.createQueryBuilder('tag')
      .where('tag.name IN (:tags)', {
        tags,
      })
      .getMany();
  }
}
