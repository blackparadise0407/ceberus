import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '@/user/user.entity';

@Entity()
@ObjectType()
export class Attachment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  path: string;

  @Column({ length: 50 })
  @Field(() => String)
  mimetype: string;

  @Column({ length: 10 })
  @Field(() => String)
  encoding: string;

  @Column({ name: 'user_id' })
  @Field(() => String)
  userId: string;

  @ManyToOne(() => User, (user) => user.attachments)
  @JoinColumn({ name: 'user_id' })
  @Field(() => User)
  user: User;
}
