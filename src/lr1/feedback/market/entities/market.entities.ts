import { ApiProperty } from '@nestjs/swagger';

export class createMarketBody {
  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;
}
