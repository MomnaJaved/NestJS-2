/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './exception_filters/all-exception-filters';
import { ErrorLoggingInterceptor } from './interceptors/error-logging.interceptor';
import { ResponseTimeInterceptor } from './interceptors/response-time.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(
    new ResponseTimeInterceptor(),
    new ErrorLoggingInterceptor(),
    new TransformInterceptor(),
  );
}
bootstrap();
