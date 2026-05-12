import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validateEnv } from './env';

async function bootstrap() {
  validateEnv();
  const app = await NestFactory.create(AppModule);
  const port = process.env.NOTIFICATIONS_PORT ?? 3001;
  await app.listen(port);
}

bootstrap();
