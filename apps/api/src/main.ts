import { cleanupOpenApiDoc } from 'nestjs-zod';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const globalPrefix = 'api';
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(globalPrefix);
  const openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('NgSurv')
      .setDescription('The NgSurv description')
      .setExternalDoc(
        'swagger.json',
        `http://localhost:${port}/${globalPrefix}/swagger.json`,
      )
      .setVersion('1.0')
      .build(),
  );

  SwaggerModule.setup('api/swagger', app, cleanupOpenApiDoc(openApiDoc), {
    jsonDocumentUrl: '/api/swagger.json',
  });
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `📑 Swagger is running on: http://localhost:${port}/${globalPrefix}/swagger`,
  );
}

void bootstrap();
