import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthMiddleware } from '../auth/middlewares/auth.middleware';
import { InvitationsController } from './controllers/invitations.controller';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [],
  controllers: [UsersController, InvitationsController],
  providers: [],
})
export class SocialModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
