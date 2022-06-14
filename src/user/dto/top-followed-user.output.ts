import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Profile } from '../profile/profile.entity';
import { User } from '../user.entity';

@ObjectType()
export class TopFollowedUser {
  @Field(() => User)
  user: User;

  @Field(() => Profile)
  profile: Profile;

  @Field(() => Int)
  count: number;
}
