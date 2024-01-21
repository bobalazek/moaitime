import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../../middlewares/app.middleware';
import { FocusSessionsController } from './controllers/focus-sessions.controller';

@Module({
  imports: [],
  controllers: [FocusSessionsController],
  providers: [],
})
export class FocusModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
