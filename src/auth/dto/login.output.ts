import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '@/users/user.entity';

@ObjectType()
export class LoginOutput {
  @Field(() => String)
  accessToken: string;

  @Field(() => User)
  user: User;
}
