import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //TODO: si healthy check falla excluirlo desde acá
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health-status', method: RequestMethod.GET }],
  });

  const configService = app.get(ConfigService);
  const port = process.env.PORT || configService.get('PORT');

  await app.listen(port);
  console.log(`Applications is running on: ${await app.getUrl()}`);
}
bootstrap();
