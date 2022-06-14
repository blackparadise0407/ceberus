import {
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

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
    @InjectConnection() private readonly connection: Connection,
  ) {}

  @Query(() => [UserFollower])
  public async followers(
    @Args('userId')
    userId: string,
  ): Promise<UserFollower[]> {
    return await this.userFollowerService.repo.findFollowersByUserId(userId);
  }

  @Query(() => [UserFollower])
  public async followings(
    @Args('userId')
    userId: string,
  ): Promise<UserFollower[]> {
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
    const followedUser = await this.userService.findById(followingId);
    if (!followedUser) {
      throw new NotFoundException('Followed user does not exist');
    }
    const existingRelationship = await this.userFollowerService.findOne(
      undefined,
      {
        where: {
          followerId: sub,
          user: followedUser,
        },
      },
    );
    if (existingRelationship) {
      throw new BadRequestException(
        `User ${sub} already follow user ${followedUser.id}`,
      );
    }
    const followingUser = await this.userService.findById(sub);
    if (!followingUser) {
      throw new NotFoundException('Following user does not exist');
    }

    const userFollower = new UserFollower();
    userFollower.followerId = sub;
    userFollower.user = followedUser;
    followedUser.followerCount += 1;
    followingUser.followingCount += 1;
    // Transaction
    await this.connection.transaction(async (manager) => {
      await manager.save(userFollower);
      await manager.save(followedUser);
      await manager.save(followingUser);
    });
    return 'Follow user successfully';
  }

  @Mutation(() => String)
  public async unfollow(
    @UserD('sub') sub: string,
    @Args('unfollowingId') unfollowingId: string,
  ) {
    const existingRelationship = await this.userFollowerService.findOne(
      undefined,
      {
        where: {
          followerId: sub,
          userId: unfollowingId,
        },
        relations: ['follower', 'user'],
      },
    );
    if (!existingRelationship) {
      throw new BadRequestException('User already unfollowed');
    }
    const { user, follower } = existingRelationship;
    follower.followingCount -= 1;
    user.followerCount -= 1;
    // Transaction
    await this.connection.transaction(async (manager) => {
      await manager.remove(existingRelationship);
      await manager.save(follower);
      await manager.save(user);
    });
    return 'Unfollow user successfully';
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
