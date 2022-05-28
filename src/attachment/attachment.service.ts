import { join } from 'path';

import { Injectable } from '@nestjs/common';

import { BaseService } from '@/common/services/base.service';

import { Attachment } from './attachment.entity';
import { AttachmentRepository } from './attachment.repository';

@Injectable()
export class AttachmentService extends BaseService<
  Attachment,
  AttachmentRepository
> {
  constructor(private readonly attachmentRepo: AttachmentRepository) {
    super(attachmentRepo);
  }

  public getStaticFileDestination(filename: string) {
    return join(process.cwd(), 'public', filename);
  }

  public getFileExt(filename: string) {
    return filename.substring(filename.lastIndexOf('.') + 1, filename.length);
  }
}
