import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Management Users API')
    .setDescription('API for managing users, roles, and permissions')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'Login, register, and user authentication')
    .addTag('Users', 'User management endpoints')
    .addTag('Roles', 'Role management endpoints')
    .addTag('Permissions', 'Permission management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`\n🚀 Application is running on: http://0.0.0.0:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api-docs`);
  console.log(`\n✅ Database: Connected`);
  console.log(`✅ Authentication: JWT enabled`);
  console.log(`\n👤 Test credentials:`);
  console.log(`   Admin: admin@example.com / Admin@123`);
  console.log(`   Demo: demo@example.com / Demo@123\n`);
}
bootstrap();
