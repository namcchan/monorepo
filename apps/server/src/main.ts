import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(csurf());
  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
