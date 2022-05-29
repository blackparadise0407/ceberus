import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Attachment } from '@/attachment/attachment.entity';
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
  @JoinColumn({ name: 'user_id' })
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

  @OneToOne(() => Attachment)
  @JoinColumn({ name: 'photo_id' })
  @Field(() => Attachment, { nullable: true })
  photo: Attachment;

  @ManyToMany(() => Tag)
  @JoinTable()
  @Field(() => [Tag])
  tags: Tag[];
}
