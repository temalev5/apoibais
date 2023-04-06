import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { TagModule } from './tag/tag.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { MarketModule } from './market/market.module';

@Module({
  controllers: [FeedbackController, UserController],
  providers: [FeedbackService, UserService],
  imports: [TagModule, UserModule, MarketModule],
})
export class FeedbackModule {}
