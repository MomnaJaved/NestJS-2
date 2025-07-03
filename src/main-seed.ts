/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AdminSeed } from './seeding/admin.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(AdminSeed);
  await seeder.run();
  await app.close();
}

bootstrap();
