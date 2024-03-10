import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(3001);

  // const httpsOptions = {
  //   key: fs.readFileSync('./secrets/private-key.pem'),
  //   cert: fs.readFileSync('./secrets/public-certificate.pem'),
  // };
  // const app = await NestFactory.create(AppModule, {
  //   httpsOptions,
  // });
  // await app.listen(3000);
}
bootstrap();

// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// const config = new DocumentBuilder()
// .setTitle('OWASP TOP 10 API 2023')
// .setVersion('1.0')
// .addTag('owasp')
// .build();

// const document = SwaggerModule.createDocument(app, config);
// SwaggerModule.setup('api', app, document);
