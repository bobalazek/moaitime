import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthSettingsController } from './controllers/auth-settings.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [],
  controllers: [AuthController, AuthSettingsController],
  providers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
