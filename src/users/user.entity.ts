import { Field, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('users')
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
}
