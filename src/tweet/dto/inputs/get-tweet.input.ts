import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetTweetInput implements BaseQuery {
  @Field({ nullable: true })
  afterCursor: string | null;

  @Field({ nullable: true })
  beforeCursor: string | null;

  @Field(() => Int)
  limit: number;
}
