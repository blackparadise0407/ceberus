import { Field, InputType, Int } from '@nestjs/graphql';
import { Cursor } from 'typeorm-cursor-pagination';

@InputType()
export class GetTweetInput implements Cursor {
  @Field({ nullable: true })
  afterCursor: string | null;

  @Field({ nullable: true })
  beforeCursor: string | null;

  @Field(() => Int)
  limit: number;
}
