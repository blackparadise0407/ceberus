/* eslint-disable @typescript-eslint/no-var-requires */
import { createWriteStream, unlink } from 'fs';

import {
  BadGatewayException,
  Logger,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from '@/auth/guards/gql-auth.guard';
import { UserService } from '@/user/user.service';

import { Attachment } from './attachment.entity';
import { AttachmentService } from './attachment.service';
import { FileUploadInput } from './dto/inputs/file-upload.input';

@UseGuards(GqlAuthGuard)
@Resolver((of) => Attachment)
export class AttachmentResolver {
  private readonly logger: Logger;
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly userService: UserService,
  ) {
    this.logger = new Logger('AttachmentResolver');
  }

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

  @Mutation(() => Boolean)
  public async deleteFile(@Args('attachmentId') attachmentId: string) {
    const attachment = await this.attachmentService.findOne(attachmentId);
    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }
    unlink(attachment.path, (err) => {
      if (err) {
      }
      this.logger.log(`${attachment.path} was deleted`);
    });
    return this.attachmentService.delete(attachmentId);
  }
}
