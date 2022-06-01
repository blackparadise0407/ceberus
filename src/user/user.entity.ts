import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Attachment } from '@/attachment/attachment.entity';
import { Tweet } from '@/tweet/tweet.entity';

import { Profile } from './profile/profile.entity';

@ObjectType()
@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  @Field(() => String)
  username: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  @Field(() => String)
  email: string;

  @Column({ length: 128 })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ default: false })
  @Field(() => Boolean)
  verified: boolean;

  @Column({ default: true })
  @Field(() => Boolean)
  enabled: boolean;

  @OneToMany(() => Tweet, (tweet) => tweet.id)
  @Field(() => [Tweet])
  tweets: Tweet[];

  @Column({ name: 'avatar_id', nullable: true })
  @Field(() => String, { nullable: true })
  avatarId: number;

  @OneToOne(() => Attachment)
  @JoinColumn({ name: 'avatar_id' })
  @Field(() => Attachment, { nullable: true })
  avatar: Attachment;

  @Column({ name: 'profile_id' })
  @Field(() => Int)
  profileId: number;

  @OneToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  @Field(() => Profile)
  profile: Profile;

  @OneToMany(() => Attachment, (attachment) => attachment.user)
  @Field(() => [Attachment])
  attachments: Attachment[];
}
