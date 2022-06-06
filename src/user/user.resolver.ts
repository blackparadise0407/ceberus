import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { isUUID } from 'class-validator';

import { AttachmentService } from '@/attachment/attachment.service';
import { GqlAuthGuard } from '@/auth/guards/gql-auth.guard';
import { User as UserD } from '@/common/decorators/user.decorator';

import { UpdateCurrentUserProfileInput } from './dto/update-current-user-profile.input';
import { ProfileService } from './profile/profile.service';
import { UserFollower } from './user-follower/user-follower.entity';
import { UserFollowerService } from './user-follower/user-follower.service';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly attachmentService: AttachmentService,
    private readonly userFollowerService: UserFollowerService,
  ) {}

  @Query(() => [UserFollower])
  public async followers(
    @Args('userId')
    userId: string,
  ): Promise<UserFollower[]> {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    return await this.userFollowerService.repo.findFollowersByUserId(userId);
  }

  @Query(() => [UserFollower])
  public async followings(
    @Args('userId')
    userId: string,
  ): Promise<UserFollower[]> {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user ID');
    }
    return await this.userFollowerService.repo.findFollowingByUserId(userId);
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
  public async user(@Args('username') username: string): Promise<User> {
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

  @Mutation(() => String)
  public async follow(
    @UserD('sub') sub: string,
    @Args('followingId') followingId: string,
  ) {
    if (!isUUID(followingId)) {
      throw new BadRequestException('Invalid user ID');
    }
    const foundUser = await this.userService.findById(followingId);
    if (!foundUser) {
      throw new NotFoundException('Following user does not exist');
    }
    const userFollower = new UserFollower();
    userFollower.followerId = sub;
    userFollower.user = foundUser;
    await userFollower.save();
    return 'Follow user successfully';
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

  @Mutation(() => User)
  public async updateCurrentUserAvatar(
    @UserD('sub') sub: string,
    @Args('avatarId') avatarId: string,
  ) {
    const avatar = await this.attachmentService.findOne(avatarId);
    if (!avatar) {
      throw new NotFoundException('Attachment not found');
    }
    const currentUser = await this.userService.findOne(undefined, {
      where: { id: sub },
    });
    if (!currentUser) {
      throw new NotFoundException('User not found');
    }
    currentUser.avatar = avatar;
    await currentUser.save();
    return currentUser;
  }
}
