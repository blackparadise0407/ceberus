import { EntityRepository, Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

import { GetTweetInput } from './dto/inputs/get-tweet.input';
import { CountTweetedTagOutput } from './dto/outputs/count-tweeted-tag.output';
import { Tweet } from './tweet.entity';

@EntityRepository(Tweet)
export class TweetRepository extends Repository<Tweet> {
  public async findWithPagination(input: GetTweetInput) {
    const queryBuilder = this.createQueryBuilder('tweet').innerJoinAndSelect(
      'tweet.user',
      'user',
    );

    const paginator = buildPaginator({
      entity: Tweet,
      paginationKeys: ['createdAt'],
      query: {
        order: 'DESC',
        ...input,
      },
    });
    return await paginator.paginate(queryBuilder);
  }

  public countTopTweetedTags(): Promise<CountTweetedTagOutput[]> {
    return this.createQueryBuilder('tweet')
      .leftJoinAndSelect('tweet.tags', 'tag')
      .groupBy('tag.id')
      .addGroupBy('tag.id')
      .select('tag.id, tag.name, count(tag.id)')
      .where('tag.id IS NOT NULL')
      .orderBy('count(tag.id)', 'DESC')
      .limit(6)
      .execute();
  }
}
