import { Field, ObjectType } from '@nestjs/graphql';
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

  @OneToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  @Field(() => Profile)
  profile: Profile;

  @OneToMany(() => Attachment, (attachment) => attachment.user)
  attachments: Attachment[];
}
