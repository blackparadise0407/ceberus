import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToClass } from 'class-transformer';
import { forEach, isEmpty } from 'lodash';

import { AttachmentService } from '@/attachment/attachment.service';
import { GqlAuthGuard } from '@/auth/guards/gql-auth.guard';
import { User as UserD } from '@/common/decorators/user.decorator';

import { NewUserInput } from './dto/new-user.input';
import { UpdateCurrentUserProfileInput } from './dto/update-current-user-profile.input';
import { ProfileService } from './profile/profile.service';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly attachmentService: AttachmentService,
  ) {}

  @Query(() => [User])
  public async user(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation(() => User)
  public createUser(
    @Args('newUserInput') newUserInput: NewUserInput,
  ): Promise<User> {
    const createdUser = plainToClass(User, newUserInput);
    return this.userService.create(createdUser);
  }

  @Query(() => User)
  public async currentUser(@UserD('sub') sub: string): Promise<User> {
    const currentUser = await this.userService.findOne(sub, {
      relations: ['profile', 'profile.coverPhoto'],
    });
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }
    return currentUser;
  }

  @Query(() => User)
  public async getUser(@Args('username') username: string): Promise<User> {
    const user = await this.userService.findOne(undefined, {
      where: { username },
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException(
        `User with username of ${username} not found`,
      );
    }
    return user;
  }

  @Mutation(() => User)
  public async updateCurrentUserProfile(
    @UserD('sub') sub: string,
    @Args('updateCurrentUserProfileInput')
    updateCurrentUserProfileInput: UpdateCurrentUserProfileInput,
  ) {
    const { coverPhotoId } = updateCurrentUserProfileInput;
    const currentUser = await this.userService.findOne(undefined, {
      where: { id: sub },
      relations: ['profile'],
    });
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }
    if (coverPhotoId) {
      const photo = await this.attachmentService.findOne(coverPhotoId);
      if (!photo) {
        throw new NotFoundException('Attachment not found');
      }
    }
    const updateProfile = await this.profileService.update(
      currentUser.profile.id,
      updateCurrentUserProfileInput as any,
    );
    currentUser.profile = updateProfile;

    return currentUser;
  }
}
