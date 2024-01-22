import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../../middlewares/app.middleware';
import { MoodEntriesController } from './controllers/mood-entries.controller';
import { MoodStatisticsController } from './controllers/mood-statistics.controller';

@Module({
  imports: [],
  controllers: [MoodEntriesController, MoodStatisticsController],
  providers: [],
})
export class MoodModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
