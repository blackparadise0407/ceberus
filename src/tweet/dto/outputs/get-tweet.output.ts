import { Field, ObjectType } from '@nestjs/graphql';

import { Tweet } from '@/tweet/tweet.entity';

@ObjectType()
export class Cursor {
  @Field({ nullable: true })
  afterCursor: string;

  @Field({ nullable: true })
  beforeCursor: string;
}

@ObjectType()
export class GetTweetOutput {
  @Field(() => [Tweet])
  tweets: Tweet[];

  @Field(() => Cursor)
  cursor: Cursor;
}
