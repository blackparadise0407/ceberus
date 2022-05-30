import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateCurrentUserProfileInput {
  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  fullName: string;

  @Field({ nullable: true })
  coverPhotoId: string;
}
