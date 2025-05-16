import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:6006'],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(helmet())
  await app.listen(5000);
}

bootstrap();
