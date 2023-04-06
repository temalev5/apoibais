import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Tag } from 'src/entities/dummy.entity';

@Injectable()
export class TagService {
  constructor(@InjectEntityManager('lr3') private readonly em: EntityManager) {}

  async createTag(name: string, color: string) {
    const tag = new Tag(name, color);
    this.em.persist(tag);

    await this.em.flush();
    return;
  }
}
