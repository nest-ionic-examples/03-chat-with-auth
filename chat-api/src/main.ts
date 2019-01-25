import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnauthorizedErrorFilter } from './filters/unauthorized-error.filter';
import { AuthAdapter } from './adapters/auth.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});

  // tag::use-unauthorized-error-filter[]
  app.useGlobalFilters(new UnauthorizedErrorFilter()); // <1>
  // end::use-unauthorized-error-filter[]

  // tag::use-web-socket-auth-adapter[]
  app.useWebSocketAdapter(new AuthAdapter(app));
  // end::use-web-socket-auth-adapter[]

  await app.listen(3000);
}

bootstrap();
