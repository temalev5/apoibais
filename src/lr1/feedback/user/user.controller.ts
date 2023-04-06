import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createUserBody } from './entities/user.entities';
import { UserService } from './user.service';

@ApiTags('lr1')
@Controller('lr1/feedback/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/')
  async createUser(@Body() user: createUserBody) {
    return await this.userService.createUser(user.name, user.email);
  }
}
