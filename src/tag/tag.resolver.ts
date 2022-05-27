import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from '@/auth/guards/gql-auth.guard';

import { CreateTagInput } from './dto/inputs/create-tag.input';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';

@Resolver(() => Tag)
@UseGuards(GqlAuthGuard)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Query(() => [Tag])
  public tags() {
    return this.tagService.findAll();
  }

  @Mutation(() => Tag)
  public async createTag(
    @Args('createTagInput') createTagInput: CreateTagInput,
  ) {
    const { name } = createTagInput;
    const tag = new Tag();
    tag.name = name;
    return await this.tagService.save(tag);
  }
}
