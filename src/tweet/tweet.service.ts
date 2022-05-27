import { Injectable } from '@nestjs/common';

import { BaseService } from '@/common/services/base.service';

import { Tweet } from './tweet.entity';
import { TweetRepository } from './tweet.repository';

@Injectable()
export class TweetService extends BaseService<Tweet, TweetRepository> {
  constructor(private readonly tweetRepo: TweetRepository) {
    super(tweetRepo);
  }
}
