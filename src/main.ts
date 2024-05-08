import { NestFactory } from '@nestjs/core';
import { AppModule } from './main.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  const port = process.env.PORT || 3001;

  const config = new DocumentBuilder()
    .setTitle('Movies API')
    .setDescription(
      'The movies API to manage the producer with the longest interval between two consecutive awards, and what got two awards faster',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      persistAuthorization: true,
      displayRequestDuration: true,
      deepLinking: false,
      displayOperationId: false,
      defaultModelExpandDepth: -1,
      operationsSorter: 'alpha',
      showExtensions: true,
      showCommonExtensions: true,
      tagsSorter: 'alpha',
      validatorUrl: null,
      showMutatedRequest: false,
    },
  });

  await app.listen(port).then(() => {
    logger.log(`Server running on port ${port}`);
  });
}
bootstrap();
