import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MaxLength } from 'class-validator';

@InputType()
export class NewUserInput {
  @Field()
  @MaxLength(30)
  username: string;

  @Field()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @Field()
  @MaxLength(128)
  password: string;
}
