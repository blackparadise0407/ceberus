import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { isEmpty } from 'lodash';

import { AppModule } from './app.module';
import { initApp } from './init';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('App');
  initApp();

  if (!AppModule.isDev) {
    app.use(
      helmet({
        contentSecurityPolicy: false,
      }),
    );
  }

  app.setGlobalPrefix('/api');

  let corsOrigins: string | string[] = '';
  if (AppModule.isDev) {
    corsOrigins = '*';
  } else {
    corsOrigins = process.env.CORS_ORIGINS?.split(',');
  }

  if (isEmpty(corsOrigins)) {
    logger.error('Unable to start app due to missing cors origins');
    process.exit(1);
  }

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: corsOrigins,
  });

  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress());

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Convert to JSON
  // app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(AppModule.port);

  // Log current url of app
  let baseUrl = app.getHttpServer().address().address;
  if (baseUrl === '0.0.0.0' || baseUrl === '::') {
    baseUrl = 'localhost';
  }
  logger.log(`Listening on http://${baseUrl}:${AppModule.port}`);
}
bootstrap();
