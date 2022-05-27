import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TagModule } from '@/tag/tag.module';
import { UserModule } from '@/user/user.module';

import { ReTweet } from './retweet.entity';
import { Tweet } from './tweet.entity';
import { TweetRepository } from './tweet.repository';
import { TweetResolver } from './tweet.resolver';
import { TweetService } from './tweet.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tweet, ReTweet, TweetRepository]),
    UserModule,
    TagModule,
  ],
  providers: [TweetResolver, TweetService],
})
export class TweetModule {}
