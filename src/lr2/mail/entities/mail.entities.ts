import { ApiProperty } from '@nestjs/swagger';

export class signInDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class sendMessageDto {
  @ApiProperty()
  to: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  text: string;
}
