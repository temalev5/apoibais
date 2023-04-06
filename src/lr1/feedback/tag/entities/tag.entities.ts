import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

export class createTagBody {
  @ApiProperty()
  name: string;
  @ApiProperty()
  color: string;
}
