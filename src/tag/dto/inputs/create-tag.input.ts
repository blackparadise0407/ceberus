import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, MaxLength } from 'class-validator';

@InputType()
export class CreateTagInput {
  @Field()
  @IsDefined()
  @MaxLength(30)
  name: string;
}
