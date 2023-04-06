import { Controller, Get, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ExchangeRate } from 'src/entities/dummy.entity';
import { BankService } from './bank.service';
import { BankReport } from './entities/bank.entities';

@ApiTags('lr3')
@Controller('lr3/exchange_rate')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get('/daily')
  async getСurrencyByDate(): Promise<string> {
    // @Query('date_from') date_from: string,
    // @Query('date_to') date_to: string,
    const response = await this.bankService.getСurrencyByDate();
    return response;
  }

  @ApiCreatedResponse({
    description: 'Exchange Rate for date interval',
    type: [ExchangeRate],
  })
  @Get('/year')
  async getCurrenceByYear(
    @Query('date_from') date_from: string,
    @Query('date_to') date_to: string,
  ): Promise<ExchangeRate[]> {
    const response = await this.bankService.getCurrenceByDates(
      date_from,
      date_to,
    );
    return response;
  }

  @ApiCreatedResponse({
    description: 'Exchange count rate for date interval',
    type: [BankReport],
  })
  @Get('/count')
  async getCountByYear(
    @Query('date_from') date_from: string,
    @Query('date_to') date_to: string,
    @Query('currency') currency: string[],
  ): Promise<BankReport[]> {
    const response = await this.bankService.getCountByYear(
      date_from,
      date_to,
      currency,
    );
    return response;
  }
}
