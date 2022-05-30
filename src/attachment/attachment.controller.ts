import { createReadStream } from 'fs';

import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Response } from 'express';

import { AttachmentService } from './attachment.service';

@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}
  @Get(':attachmentId')
  public async get(
    @Param('attachmentId') attachmentId: string,
    @Res() res: Response,
  ) {
    if (!attachmentId) {
      throw new BadRequestException('Attachment ID is required');
    }

    if (!isUUID(attachmentId)) {
      throw new BadRequestException('Invalid attachment ID');
    }

    const attachment = await this.attachmentService.findOne(attachmentId);

    if (!attachment) {
      throw new NotFoundException(
        'The requested resource is not found on this server',
      );
    }

    const readStream = createReadStream(attachment.path);

    readStream.on('open', function () {
      readStream.pipe(res);
    });

    readStream.on('error', function () {
      res
        .status(404)
        .send('The requested resource is not found on this server');
    });
  }
}
