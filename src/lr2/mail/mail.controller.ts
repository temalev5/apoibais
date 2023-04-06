import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { extractTokenFromHeader } from 'src/helpers/helpers';
import { signInDto, sendMessageDto } from './entities/mail.entities';
import { AuthGuard } from './mail.guard';
import { MailService } from './mail.service';

@ApiTags('lr2')
@Controller('lr2/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/login')
  async signIn(@Body() signInDto: signInDto) {
    return await this.mailService.loginSmtp(
      signInDto.email,
      signInDto.password,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/sendMessage')
  async sendMessage(@Body() messageDto: sendMessageDto, @Req() req) {
    return await this.mailService.sendMessage(
      messageDto.to,
      messageDto.subject,
      messageDto.text,
      req.user,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/getMessage')
  async getMessage(@Req() req) {
    return await this.mailService.getMessage(req.user);
  }
}
