import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Attachment } from '@/attachment/attachment.entity';

@Entity()
@ObjectType()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column({ name: 'full_name', length: 50 })
  @Field(() => String)
  fullName: string;

  @Column({ length: 255 })
  @Field(() => String)
  description: string;

  @OneToOne(() => Attachment, (attachment) => attachment.id)
  @JoinColumn({ name: 'cover_photo_id' })
  coverPhoto: Attachment;
}
