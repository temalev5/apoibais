import { ApiProperty } from '@nestjs/swagger';

export class createUserBody {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
