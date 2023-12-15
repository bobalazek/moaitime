import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../core/middlewares/app.middleware';
import { CalendarEntriesController } from './controllers/calendar-entries.controller';

@Module({
  imports: [],
  controllers: [CalendarEntriesController],
  providers: [],
})
export class CalendarsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
