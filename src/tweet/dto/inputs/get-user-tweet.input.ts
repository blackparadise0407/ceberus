import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetUserTweetInput implements BaseQuery {
  @Field(() => String)
  userId: string;

  @Field({ nullable: true })
  afterCursor: string | null;

  @Field({ nullable: true })
  beforeCursor: string | null;

  @Field(() => Int)
  limit: number;
}
