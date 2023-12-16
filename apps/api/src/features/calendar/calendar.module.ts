import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../core/middlewares/app.middleware';
import { CalendarEntriesController } from './controllers/calendar-entries.controller';
import { EventsController } from './controllers/events.controller';

@Module({
  imports: [],
  controllers: [CalendarEntriesController, EventsController],
  providers: [],
})
export class CalendarsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
