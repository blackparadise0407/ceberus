import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Tag } from '@/tag/tag.entity';
import { User } from '@/user/user.entity';

import { ReTweet } from './retweet.entity';

@Entity('tweet')
@ObjectType()
export class Tweet extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => String)
  text: string;

  @Field(() => String)
  user_id: string;

  @ManyToOne(() => User, (user) => user.tweets)
  @Field(() => User)
  user: User;

  @CreateDateColumn({ name: 'created_at' })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => Date)
  updatedAt: Date;

  @OneToMany(() => ReTweet, (retweet) => retweet.tweet)
  @Field(() => [ReTweet])
  retweets: ReTweet[];

  @ManyToMany(() => Tag)
  @JoinTable()
  @Field(() => [Tag])
  tags: Tag[];
}
