import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AccountController } from './controllers/account.controller';
import { AuthController } from './controllers/auth.controller';
import { PingController } from './controllers/ping.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [],
  controllers: [AuthController, AccountController, PingController],
  providers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
