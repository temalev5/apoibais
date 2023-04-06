import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Market } from 'src/entities/dummy.entity';

@Injectable()
export class MarketService {
  constructor(@InjectEntityManager('lr3') private readonly em: EntityManager) {}

  async createMarket(name, address) {
    const market = new Market(name, address);
    this.em.persist(market);

    await this.em.flush();
    return;
  }
  async getMarket(id: number) {
    const market = await this.em.findOne(Market, { id });
    if (!market) return new NotFoundException();
    return { name: market.name, address: market.address };
  }
}
