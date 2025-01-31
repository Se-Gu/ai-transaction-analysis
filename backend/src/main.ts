import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // Local development
      'https://transaction-analyzer.netlify.app', // Netlify production frontend
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    credentials: true, // Allow cookies and authentication headers
  });

  await app.listen(5800);
}
bootstrap();
