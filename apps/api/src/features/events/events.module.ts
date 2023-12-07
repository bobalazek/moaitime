import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../core/middlewares/app.middleware';
import { EventsController } from './controllers/events.controller';

@Module({
  imports: [],
  controllers: [EventsController],
  providers: [],
})
export class EventsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
