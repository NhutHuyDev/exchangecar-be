import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors();

  const PORT = process.env.PORT;

  await app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
  });
}
bootstrap();
