import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetUserTweetInput {
  @Field(() => String)
  userId: string;
}
