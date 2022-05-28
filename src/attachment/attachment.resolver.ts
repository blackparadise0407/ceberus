/* eslint-disable @typescript-eslint/no-var-requires */
import { createWriteStream } from 'fs';

import { BadGatewayException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from '@/auth/guards/gql-auth.guard';
import { UserService } from '@/user/user.service';

import { Attachment } from './attachment.entity';
import { AttachmentService } from './attachment.service';
import { FileUploadInput } from './dto/inputs/file-upload.input';

@UseGuards(GqlAuthGuard)
@Resolver((of) => Attachment)
export class AttachmentResolver {
  constructor(
    private readonly attachmentService: AttachmentService,

    private readonly userService: UserService,
  ) {}

  @Mutation(() => Attachment)
  async uploadFile(
    @Args('fileUploadInput') fileUploadInput: FileUploadInput,
  ): Promise<Attachment | null> {
    const { file, userId } = fileUploadInput;
    return Promise.resolve(file).then(
      async ({ filename, mimetype, encoding, createReadStream }) => {
        const attachment = new Attachment();
        const owner = await this.userService.findOne(userId);
        if (!owner) {
          throw new BadGatewayException('User not found');
        }
        const ext = this.attachmentService.getFileExt(filename);
        attachment.path = this.attachmentService.getStaticFileDestination(
          Date.now().toString().concat('.', ext),
        );
        attachment.encoding = encoding;
        attachment.mimetype = mimetype;
        attachment.user = owner;
        await attachment.save();
        return new Promise(async (resolve, reject) =>
          createReadStream()
            .pipe(createWriteStream(attachment.path))
            .on('finish', () => resolve(attachment))
            .on('error', () => reject(null)),
        );
      },
    );
  }
}
