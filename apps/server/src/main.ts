import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import helmet from 'helmet';
import { AppModule } from './app.module';

import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import rateLimit from 'express-rate-limit';
import * as compression from 'compression';
import * as session from 'express-session';
import { middleware as expressCtx } from 'express-ctx';
import { setupSwagger } from './swagger';
import { TrimStringsPipe } from './common/transformers/trim-string.pipe';
import { useContainer } from 'class-validator';
import { SharedModule } from './shared/shared.module';
import { AppConfigService } from './shared/service/app-config.service';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  const logger = new Logger(AppModule.name);

  const config = app.select(SharedModule).get(AppConfigService);

  app.useGlobalPipes(new TrimStringsPipe(), new ValidationPipe({}));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(cookieParser());
  app.use(
    session({
      secret: 'your-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.use(morgan('combined'));
  app.use(csurf({ cookie: true }));
  app.enableVersioning();
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 100,
    }),
  );

  app.use(expressCtx);

  if (config.nats.isEnabled) {
    const natsConfig = config.nats;
    app.connectMicroservice({
      transport: Transport.NATS,
      options: {
        url: `nats://${natsConfig.host}:${natsConfig.port}`,
        queue: 'main_service',
      },
    });

    await app.startAllMicroservices();
  }

  if (config.documentationEnabled) {
    setupSwagger(app);
  }

  await app.listen(3000);
  logger.log(`server running on ${await app.getUrl()}`);

  return app;
}
bootstrap();
