import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';

import { NewUserInput } from './dto/new-user.input';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  public async User(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation(() => User)
  public create(@Args('newUserData') newUserData: NewUserInput): Promise<User> {
    const createdUser = plainToClass(User, newUserData);
    return this.userService.create(createdUser);
  }
}
