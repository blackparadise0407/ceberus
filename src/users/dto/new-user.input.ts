import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MaxLength } from 'class-validator';

@InputType()
export class NewUserInput {
  @Field()
  @MaxLength(30)
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MaxLength(255)
  password: string;
}
