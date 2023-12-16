import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../core/middlewares/app.middleware';
import { CalendarEntriesController } from './controllers/calendar-entries.controller';
import { CalendarsController } from './controllers/calendars.controller';
import { EventsController } from './controllers/events.controller';

@Module({
  imports: [],
  controllers: [CalendarsController, CalendarEntriesController, EventsController],
  providers: [],
})
export class CalendarsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
