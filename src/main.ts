import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'node:fs/promises';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('lr example')
    .setDescription('The example API description')
    .setVersion('1.0')
    .addBearerAuth()
    // .addTag('cats')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  fs.writeFile('./swagger-spec.json', JSON.stringify(document));
  await app.listen(3000);
}
bootstrap();
