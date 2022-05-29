import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTweetInput {
  @Field()
  text: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  photoId: string;

  @Field(() => [String])
  tags: string[];
}
