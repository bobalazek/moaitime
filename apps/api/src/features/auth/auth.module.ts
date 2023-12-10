import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthAccountController } from './controllers/auth-account.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [],
  controllers: [AuthController, AuthAccountController],
  providers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
