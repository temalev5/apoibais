import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createMarketBody } from './entities/market.entities';
import { MarketService } from './market.service';

@ApiTags('lr1')
@Controller('lr1/feedback/market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('/:id')
  async getMarket(@Param('id') id: number) {
    return await this.marketService.getMarket(id);
  }

  @Post('/')
  async createMarket(@Body() market: createMarketBody) {
    return await this.marketService.createMarket(market.name, market.address);
  }
}
