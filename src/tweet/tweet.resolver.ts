import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AttachmentService } from '@/attachment/attachment.service';
import { GqlAuthGuard } from '@/auth/guards/gql-auth.guard';
import { Tag } from '@/tag/tag.entity';
import { TagService } from '@/tag/tag.service';
import { UserService } from '@/user/user.service';

import { GetTweetInput } from './dto/inputs/get-tweet.input';
import { GetUserTweetInput } from './dto/inputs/get-user-tweet.input';
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
    private readonly attachmentService: AttachmentService,
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

  @Query(() => GetTweetOutput)
  public async getUserTweet(
    @Args('getUserTweetInput') getUserTweetInput: GetUserTweetInput,
  ) {}

  @Mutation(() => Tweet)
  public async createTweet(
    @Args('createTweetInput') createTweetInput: CreateTweetInput,
  ) {
    const { userId, text, photoId, tags } = createTweetInput;
    const foundUser = await this.userService.findOne(userId);
    if (!foundUser) {
      throw new BadRequestException(`User with ID ${userId} not found`);
    }
    const addedTags: Tag[] = [];
    for (const tag of tags) {
      const foundTag = await this.tagService.findOne(undefined, {
        where: { name: tag },
      });
      if (!foundTag) {
        const newTag = new Tag();
        newTag.name = tag;
        await newTag.save();
        addedTags.push(newTag);
      } else {
        addedTags.push(foundTag);
      }
    }
    const tweet = new Tweet();
    if (photoId) {
      const photo = await this.attachmentService.findOne(photoId);
      if (photo) {
        tweet.photo = photo;
      }
    }
    tweet.user = foundUser;
    tweet.text = text;
    tweet.tags = addedTags;
    return await this.tweetService.save(tweet);
  }

  @Query(() => [CountTweetedTagOutput])
  public async getTopTweetedTagCount() {
    return await this.tweetService.repo.countTopTweetedTags();
  }
}
