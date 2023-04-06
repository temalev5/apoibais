import { ApiProperty } from '@nestjs/swagger';

class CurrencyCount {
  @ApiProperty()
  min: number;

  @ApiProperty()
  max: number;

  @ApiProperty()
  avg: number;
}

export class BankReport {
  @ApiProperty()
  currency: string;

  @ApiProperty()
  count: CurrencyCount;
}
