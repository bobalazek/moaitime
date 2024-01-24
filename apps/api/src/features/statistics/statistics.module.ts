import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../../middlewares/app.middleware';
import { MoodStatisticsController } from './controllers/mood-statistics.controller';
import { StatisticsController } from './controllers/statistics.controller';

@Module({
  imports: [],
  controllers: [StatisticsController, MoodStatisticsController],
  providers: [],
})
export class StatisticsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
