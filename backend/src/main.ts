import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { OrmMetadata } from './app/config/orm-metadata';
import mikroOrmConfig from './mikro-orm.config';
import helmet from 'helmet';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.set('trust proxy', 1);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger configuration
  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Test NestJs')
      .setDescription('API documentation for Test NestJs application')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'JWT Token eingeben',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);
  }

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ limit: '10kb', extended: true }));

  // Mikro-ORM and database schema synchronization
  await OrmMetadata.init(mikroOrmConfig);
  // await OrmMetadata.synchronizeDbSchema();
  await OrmMetadata.runMigrations();

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
