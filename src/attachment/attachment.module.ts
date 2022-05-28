import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@/user/user.module';

import { AttachmentController } from './attachment.controller';
import { Attachment } from './attachment.entity';
import { AttachmentRepository } from './attachment.repository';
import { AttachmentResolver } from './attachment.resolver';
import { AttachmentService } from './attachment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment, AttachmentRepository]),
    UserModule,
  ],
  providers: [AttachmentResolver, AttachmentService],
  exports: [AttachmentService],
  controllers: [AttachmentController],
})
export class AttachmentModule {}
