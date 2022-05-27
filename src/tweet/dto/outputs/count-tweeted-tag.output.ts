import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CountTweetedTagOutput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  count: number;
}
