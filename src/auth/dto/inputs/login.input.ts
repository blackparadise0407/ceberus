import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, MaxLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsDefined()
  username: string;

  @Field(() => String)
  @IsDefined()
  @MaxLength(128)
  password: string;
}
