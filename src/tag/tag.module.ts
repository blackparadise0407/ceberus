import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tag } from './tag.entity';
import { TagRepository } from './tag.repository';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, TagRepository])],
  providers: [TagResolver, TagService],
  exports: [TagService],
})
export class TagModule {}
