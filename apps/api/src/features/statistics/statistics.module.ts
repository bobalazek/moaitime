import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../../middlewares/app.middleware';
import { CalendarStatisticsController } from './controllers/calendar-statistics.controller';
import { FocusStatisticsController } from './controllers/focus-statistics.controller';
import { HabitsStatisticsController } from './controllers/habits-statistics.controller';
import { MoodStatisticsController } from './controllers/mood-statistics.controller';
import { NotesStatisticsController } from './controllers/notes-statistics.controller';
import { StatisticsController } from './controllers/statistics.controller';
import { TasksStatisticsController } from './controllers/tasks-statistics.controller';

@Module({
  imports: [],
  controllers: [
    StatisticsController,
    CalendarStatisticsController,
    TasksStatisticsController,
    HabitsStatisticsController,
    NotesStatisticsController,
    MoodStatisticsController,
    FocusStatisticsController,
  ],
  providers: [],
})
export class StatisticsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
