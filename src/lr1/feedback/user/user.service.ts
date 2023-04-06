import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/dummy.entity';

@Injectable()
export class UserService {
  constructor(@InjectEntityManager('lr3') private readonly em: EntityManager) {}

  async createUser(name: string, email: string) {
    const user = new User(name, email);
    this.em.persist(user);

    await this.em.flush();
    return;
  }
}
