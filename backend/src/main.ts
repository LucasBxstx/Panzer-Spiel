import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { OrmMetadata } from './app/config/orm-metadata';
import mikroOrmConfig from './mikro-orm.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Test NestJs')
    .setDescription('API documentation for Test NestJs application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  // Mikro-ORM and database schema synchronization
  await OrmMetadata.init(mikroOrmConfig);
  // await OrmMetadata.synchronizeDbSchema();
  await OrmMetadata.runMigrations();

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
