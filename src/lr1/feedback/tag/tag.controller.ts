import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createTagBody } from './entities/tag.entities';
import { TagService } from './tag.service';

@ApiTags('lr1')
@Controller('lr1/feedback/tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('/')
  async createTag(@Body() tag: createTagBody) {
    return await this.tagService.createTag(tag.name, tag.color);
  }
}
