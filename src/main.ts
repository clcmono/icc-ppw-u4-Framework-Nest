import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './exceptions/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Registrar el filter global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configurar ValidationPipe para DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // elimina propiedades no permitidas
      forbidNonWhitelisted: true, // error si envían campos extra
      transform: true,        // transforma tipos
    }),
  );

  await app.listen(3000);
}
bootstrap();