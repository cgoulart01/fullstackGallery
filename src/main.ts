import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(
    {
      origin: 'http://localhost:4200',
      methods: 'GET,POST,PUT,PATCH,POST,DELETE',
      Credentials: true,
    }
  );


  const config = new DocumentBuilder()
    .setTitle('API de Imagens')
    .setDescription('Documentação da API para gerenciar imagens')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
