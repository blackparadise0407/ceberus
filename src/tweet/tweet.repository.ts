import { EntityRepository, Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';

import { GetTweetInput } from './dto/inputs/get-tweet.input';
import { GetUserTweetInput } from './dto/inputs/get-user-tweet.input';
import { CountTweetedTagOutput } from './dto/outputs/count-tweeted-tag.output';
import { Tweet } from './tweet.entity';

@EntityRepository(Tweet)
export class TweetRepository extends Repository<Tweet> {
  public async findWithPagination(input: GetTweetInput) {
    const queryBuilder = this.createQueryBuilder('tweet')
      .leftJoinAndSelect('tweet.photo', 'attachment')
      .leftJoinAndSelect('tweet.tags', 'tag')
      .innerJoinAndSelect('tweet.user', 'user');

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

  // TODO: Implement later
  // public async findByUser(input: GetUserTweetInput) {
  //   const { userId } = input;
  //   const qb = this.createQueryBuilder('tweet').where('userId == :userId', {
  //     userId,
  //   });

  //   const paginator = buildPaginator({
  //     entity: Tweet,
  //     paginationKeys: ['createdAt'],
  //     query: {
  //       order: 'DESC',

  //     }
  //   })
  // }
}
