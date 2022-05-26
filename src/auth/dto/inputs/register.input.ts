import { Field, InputType } from '@nestjs/graphql';
import { IsDefined, IsEmail, MaxLength } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field(() => String)
  @MaxLength(30)
  username: string;

  @Field(() => String)
  @IsDefined()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @Field(() => String)
  @MaxLength(128)
  password: string;

  @Field(() => String)
  @MaxLength(128)
  confirmPassword: string;
}
