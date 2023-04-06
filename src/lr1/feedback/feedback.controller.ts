import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Feedback } from 'src/entities/dummy.entity';
import { createFeedbackBody } from './entities/feedback.entities';
import { FeedbackService } from './feedback.service';

@ApiTags('lr1')
@Controller('lr1/feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @ApiCreatedResponse({
    description: 'Модель обратной связи',
    type: [Feedback],
  })
  @Get('/:id')
  async getFeedback(@Param('id') id: number): Promise<Feedback> {
    return await this.feedbackService.getFeedback(id);
  }

  @Post('/')
  async createFeedback(@Body() feedback: createFeedbackBody) {
    return this.feedbackService.createFeedback(
      feedback.user_id,
      feedback.market_id,
      feedback.tags_ids,
      feedback.text,
    );
  }
}
