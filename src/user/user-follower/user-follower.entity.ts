import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../user.entity';

@ObjectType()
@Entity({ name: 'user_follower' })
export class UserFollower extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column({ name: 'user_id' })
  @Field(() => String)
  userId: string;

  @Column({ name: 'follower_id' })
  @Field(() => String)
  followerId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  @Field(() => User)
  user: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'follower_id' })
  @Field(() => User)
  follower: User;
}
