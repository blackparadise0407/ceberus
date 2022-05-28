import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '@/user/user.entity';

import { Tweet } from './tweet.entity';

@Entity('retweet')
@ObjectType()
export class ReTweet extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String)
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @Field(() => User)
  user: User;

  @Field(() => Int)
  tweet_id: number;

  @ManyToOne(() => Tweet, (tweet) => tweet.id)
  @JoinColumn({ name: 'tweet_id' })
  @Field(() => Tweet)
  tweet: Tweet;
}
