import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  const PORT = process.env.PORT;
  await app.listen(PORT || 60000, () =>
    Logger.log(`Server start on port ${PORT || 6000}`),
  );
}
bootstrap();
