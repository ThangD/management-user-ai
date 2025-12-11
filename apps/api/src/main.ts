import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    console.log('🔧 Initializing NestJS application...');
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    console.log('✅ NestJS application created');

    // Enable CORS
    app.enableCors({
      origin: true,
      credentials: true,
    });
    console.log('✅ CORS enabled');

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    console.log('✅ Validation pipe configured');

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
    console.log('✅ Swagger documentation configured');

    const port = process.env.PORT || 3001;
    const host = '0.0.0.0';
    
    console.log(`🔌 Attempting to bind to ${host}:${port}...`);
    await app.listen(port, host);

    console.log('\n================================================');
    console.log(`🚀 Application is running on: http://${host}:${port}`);
    console.log(`📚 Swagger documentation: http://localhost:${port}/api-docs`);
    console.log(`🏥 Health check: http://localhost:${port}/health`);
    console.log(`\n✅ Database: Connected`);
    console.log(`✅ Authentication: JWT enabled`);
    console.log(`\n👤 Test credentials:`);
    console.log(`   Admin: admin@example.com / Admin@123`);
    console.log(`   Demo: demo@example.com / Demo@123`);
    console.log('================================================\n');
  } catch (error) {
    console.error('\n❌ Failed to start application:');
    console.error(error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('\n❌ Bootstrap failed:');
  console.error(error);
  process.exit(1);
});
