import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from '@/auth/guards/gql-auth.guard';
import { TagService } from '@/tag/tag.service';
import { UserService } from '@/user/user.service';

import { GetTweetInput } from './dto/inputs/get-tweet.input';
import { CreateTweetInput } from './dto/inputs/new-tweet.input';
import { CountTweetedTagOutput } from './dto/outputs/count-tweeted-tag.output';
import { GetTweetOutput } from './dto/outputs/get-tweet.output';
import { Tweet } from './tweet.entity';
import { TweetService } from './tweet.service';

@Resolver(() => Tweet)
@UseGuards(GqlAuthGuard)
export class TweetResolver {
  constructor(
    private readonly tweetService: TweetService,
    private readonly userService: UserService,
    private readonly tagService: TagService,
  ) {}

  @Query(() => GetTweetOutput)
  public async getTweet(
    @Args('getTweetInput') getTweetInput: GetTweetInput,
  ): Promise<GetTweetOutput> {
    const { data, cursor } = await this.tweetService.repo.findWithPagination(
      getTweetInput,
    );
    return { tweets: data, cursor };
  }

  @Mutation(() => Tweet)
  public async createTweet(
    @Args('createTweetInput') createTweetInput: CreateTweetInput,
  ) {
    const { userId, text } = createTweetInput;
    const foundUser = await this.userService.findOne(userId);
    if (!foundUser) {
      throw new BadRequestException(`User with ID ${userId} not found`);
    }
    const tags = await this.tagService.findAll();
    const tweet = new Tweet();
    tweet.user = foundUser;
    tweet.text = text;
    tweet.tags = tags;
    return await this.tweetService.save(tweet);
  }

  @Query(() => [CountTweetedTagOutput])
  public async getTopTweetedTagCount() {
    return await this.tweetService.repo.countTopTweetedTags();
  }
}
