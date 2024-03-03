import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthMiddleware } from '../auth/middlewares/auth.middleware';
import { FeedController } from './controllers/feed.controller';
import { InvitationsController } from './controllers/invitations.controller';
import { PostsController } from './controllers/posts.controller';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [],
  controllers: [UsersController, InvitationsController, PostsController, FeedController],
  providers: [],
})
export class SocialModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
