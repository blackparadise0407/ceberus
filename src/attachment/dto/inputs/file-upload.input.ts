import { Field, InputType } from '@nestjs/graphql';
import { IsDefined } from 'class-validator';
// eslint-disable-next-line import/no-unresolved
import { FileUpload } from 'graphql-upload';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const GraphQLUpload = require('graphql-upload/GraphQLUpload.js');

@InputType()
export class FileUploadInput {
  @IsDefined()
  @Field(() => GraphQLUpload)
  file: FileUpload;

  @Field(() => String)
  @IsDefined()
  userId: string;
}
