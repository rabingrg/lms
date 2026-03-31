import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown fields (random keys)
      forbidNonWhitelisted: true, // throws error for random keys
      transform: true, // applies DTO types
    }),
  );
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
