import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // Disable global body parser to fix Better Auth integration
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  const configService = app.get(ConfigService);
  
  // Set global prefix for all routes
  app.setGlobalPrefix('api');
  
  // Enable validation pipes globally, but exclude auth routes from body parsing
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Enable CORS with configuration
  app.enableCors({
    origin: configService.get('cors.origin'),
    credentials: true,
  });
  
  // Swagger Configuration - only if enabled
  if (configService.get('swagger.enabled')) {
    const config = new DocumentBuilder()
      .setTitle(configService.get('swagger.title'))
      .setDescription(configService.get('swagger.description'))
      .setVersion(configService.get('swagger.version'))
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management endpoints')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(configService.get('swagger.path'), app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }
  
  const port = configService.get('port');
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  
  if (configService.get('swagger.enabled')) {
    console.log(`Swagger documentation available at: ${await app.getUrl()}/${configService.get('swagger.path')}`);
  }
}
bootstrap();
