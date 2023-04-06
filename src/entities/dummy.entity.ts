import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ExchangeRate {
  @ApiProperty()
  @PrimaryKey()
  date: Date;

  @ApiProperty()
  @PrimaryKey()
  currency: string;

  @ApiProperty()
  @Property()
  value: number;

  constructor(date: Date, currency: string, value: number) {
    this.date = date;
    this.currency = currency;
    this.value = value;
  }
}

@Entity()
export class Tag {
  @ApiProperty()
  @PrimaryKey()
  id: number;

  @ApiProperty()
  @Property()
  name: string;

  @ApiProperty()
  @Property()
  color: string;

  constructor(name, color) {
    this.name = name;
    this.color = color;
  }
}

@Entity()
export class User {
  @ApiProperty()
  @PrimaryKey()
  id: number;

  @ApiProperty()
  @Property()
  name: string;

  @ApiProperty()
  @Property()
  email: string;

  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

@Entity()
export class Market {
  @ApiProperty()
  @PrimaryKey()
  id: number;

  @ApiProperty()
  @Property()
  name: string;

  @ApiProperty()
  @Property()
  address: string;

  constructor(name, address) {
    this.name = name;
    this.address = address;
  }
}

@Entity()
export class Feedback {
  @ApiProperty()
  @PrimaryKey()
  id: number;

  @OneToMany(() => FeedbackTag, (feedbackTag) => feedbackTag.feedback)
  tags = new Collection<FeedbackTag>(this);
  // @ApiProperty()
  @ManyToOne()
  market: Market;

  @ApiProperty()
  @ManyToOne()
  user: User;

  @ApiProperty()
  @Property()
  text: string;

  constructor(market_id, user_id, text) {
    this.market = market_id;
    this.user = user_id;
    this.text = text;
  }
}

@Entity()
export class FeedbackTag {
  @ApiProperty()
  @ManyToOne({ primary: true })
  feedback: Feedback;

  @ApiProperty()
  @ManyToOne({ primary: true })
  tag: Tag;

  constructor(feedback_id, tag_id) {
    this.feedback = feedback_id;
    this.tag = tag_id;
  }
}
