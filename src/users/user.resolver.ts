import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';

import { GqlAuthGuard } from '@/auth/guards/gql-auth.guard';
import { User as UserD } from '@/common/decorators/user.decorator';

import { NewUserInput } from './dto/new-user.input';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  public async user(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation(() => User)
  public create(@Args('newUserData') newUserData: NewUserInput): Promise<User> {
    const createdUser = plainToClass(User, newUserData);
    return this.userService.create(createdUser);
  }

  @Query(() => User)
  public async currentUser(@UserD('sub') sub: string): Promise<User> {
    const currentUser = await this.userService.findOne(sub);
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }
    return currentUser;
  }
}
