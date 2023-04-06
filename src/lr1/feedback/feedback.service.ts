import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Feedback, FeedbackTag, Tag } from 'src/entities/dummy.entity';

@Injectable()
export class FeedbackService {
  constructor(@InjectEntityManager('lr3') private readonly em: EntityManager) {}

  async getFeedback(id: number) {
    const feedback = await this.em.findOne(
      Feedback,
      { id: id },
      { populate: ['tags'] },
    );
    return feedback;
  }

  async createFeedback(user_id, market_id, tags_ids: number[], text) {
    const tags = await this.em.find(Tag, { id: tags_ids });
    const feedback = new Feedback(market_id, user_id, text);

    for (const tag of tags) {
      const feedbackTag = new FeedbackTag(feedback, tag);
      this.em.persist(feedbackTag);
    }
    this.em.persist(feedback);

    await this.em.flush();
    return;
  }
}
