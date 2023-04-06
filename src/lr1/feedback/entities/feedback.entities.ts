import { ApiProperty } from '@nestjs/swagger';

export class createFeedbackBody {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  market_id: number;

  @ApiProperty({ type: [Number] })
  tags_ids: number[];

  @ApiProperty()
  text: string;
}
