import { Field, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  username: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ default: false })
  @Field(() => Boolean)
  verified: boolean;

  @Column({ default: true })
  @Field(() => Boolean)
  enabled: boolean;
}
