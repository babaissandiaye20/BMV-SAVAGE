import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { RedisService } from './redis/redis.service';
import { CacheInterceptor as CustomCacheInterceptor } from './common/interceptor/cache.interceptor';
import { ValidationService } from './validation/validation.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';
import { Response } from 'express';
// src/main.ts
// ← ajoute cette ligne en haut


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const validationService = app.get(ValidationService);
  app.useGlobalPipes(validationService);
  const redisService = app.get(RedisService);

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new CustomCacheInterceptor(reflector, redisService),
  );

  const config = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('API for managing users')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'documentation'), {
    prefix: '/docs',
  });
  app.getHttpAdapter().get('/docs', (req, res: Response) => {
    res.redirect('/docs/index.html');
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
