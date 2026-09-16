import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Prefijo global de la API
  app.setGlobalPrefix('api');

  // Habilitar CORS para integración con Next.js
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Validación global estricta de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de OpenAPI / Swagger
  const config = new DocumentBuilder()
    .setTitle('Ventas Fix - API Backoffice')
    .setDescription(
      'API REST para el microservicio de gestión de usuarios, catálogo de productos con IVA y clientes empresa de Ventas Fix.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Generación automática del archivo spec/oas.yaml al montar la app
  try {
    const specDir = path.resolve(process.cwd(), 'spec');
    if (!fs.existsSync(specDir)) {
      fs.mkdirSync(specDir, { recursive: true });
    }
    const yamlString = yaml.stringify(document);
    fs.writeFileSync(path.join(specDir, 'oas.yaml'), yamlString, 'utf8');
    logger.log(`Especificación OpenAPI generada exitosamente en spec/oas.yaml`);
  } catch (error) {
    logger.error('Error al generar spec/oas.yaml:', error);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Servidor iniciado en http://localhost:${port}/api`);
  logger.log(`Documentación interactiva disponible en http://localhost:${port}/api/docs`);
}
bootstrap();

