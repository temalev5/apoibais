import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankModule } from './lr3/bank/bank.module';
import { MailModule } from './lr2/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { FeedbackModule } from './lr1/feedback/feedback.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MikroOrmModule.forRoot({
      contextName: 'lr3',
      registerRequestContext: false,
      autoLoadEntities: true,
      entities: ['./dist/entities'],
      entitiesTs: ['./src/entities'],
      type: 'postgresql',
      allowGlobalContext: true,
      debug: true,
      host: 'localhost',
      dbName: 'lr3',
      port: Number('5432'),
      user: 'lr3',
      password: '123',
    }),
    BankModule,
    MailModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    FeedbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
