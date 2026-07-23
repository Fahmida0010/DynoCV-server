import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api',{ exclude: ['/'] });

  // Frontend CORS configuration
  app.enableCors({
    origin: process.env.CLIENT_URL, 
    credentials: true,
  });
  
  // Data transformation and validation pipeline
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    transform: true,  
  }));


  app.use(passport.initialize());

  const port = process.env.PORT || 5000;

  await app.listen(port);
  console.log(`🚀 Backend Server running on: http://localhost:${port}`);
}
bootstrap();