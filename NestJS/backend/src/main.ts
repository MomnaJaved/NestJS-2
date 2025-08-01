import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './exception_filters/all-exception-filters';
import { ErrorLoggingInterceptor } from './interceptors/error-logging.interceptor';
import { ResponseTimeInterceptor } from './interceptors/response-time.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AdminSeed } from './seeding/admin.seed';
//main ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // You can run seeding here:
  const adminSeed = app.get(AdminSeed);
  await adminSeed.run();

  // Set up Swagger
  const options = new DocumentBuilder()
    .setTitle('Attendance Management System API')
    .setDescription('API documentation for Attendance Management System')
    .setVersion('1.0.0')
    .addBearerAuth() // This enables JWT Bearer authentication in Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document); // Swagger UI will be available at /api-docs

  // Enable CORS for frontend (localhost:5173)
  app.enableCors({
    origin: 'http://localhost:5173', // Allow requests from React frontend (port 5173)
    methods: 'GET,POST,PUT,DELETE,PATCH', // Allow HTTP methods
    credentials: true, // Allow cookies and credentials
  });

  await app.listen(3001); // Make sure the backend is running on port 3001

  // Global middlewares
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(
    new ResponseTimeInterceptor(),
    new ErrorLoggingInterceptor(),
    new TransformInterceptor(),
  );
}
bootstrap();
