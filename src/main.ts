import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Frontend CORS configuration
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', 
    credentials: true,
  });
  
  // Data transformation and validation pipeline
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO-র বাইরের ফালতু ডেটা ফিল্টার করে দেবে
    transform: true,  // ইনপুট ডেটাকে সঠিক টাইপে রূপান্তর করবে
  }));

  // পোর্টের মানটি প্রথমে ভ্যারিয়েবলে নিয়ে নেওয়া হলো
  const port = process.env.PORT || 5000;

  // এখন লিসেন এবং কনসোল লগ দুটাই একই ডাইনামিক পোর্টে কাজ করবে
  await app.listen(port);
  console.log(`🚀 Backend Server running on: http://localhost:${port}`);
}
bootstrap();