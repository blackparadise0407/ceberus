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

  @Column({ name: 'full_name', length: 50, default: '' })
  @Field(() => String)
  fullName: string;

  @Column({ length: 255, default: '' })
  @Field(() => String)
  description: string;

  @Column({ name: 'cover_photo_id', nullable: true })
  @Field(() => String, { nullable: true })
  coverPhotoId: string;

  @OneToOne(() => Attachment)
  @JoinColumn({ name: 'cover_photo_id' })
  @Field(() => Attachment, { nullable: true })
  coverPhoto: Attachment;
}
