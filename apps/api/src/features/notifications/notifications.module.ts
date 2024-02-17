import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../../middlewares/app.middleware';
import { UserNotificationsController } from './controllers/user-notifications.controller';

@Module({
  imports: [],
  controllers: [UserNotificationsController],
  providers: [],
})
export class NotificationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
