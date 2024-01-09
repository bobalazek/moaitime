import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../../middlewares/app.middleware';
import { MoodEntriesController } from './controllers/mood-entries.controller';

@Module({
  imports: [],
  controllers: [MoodEntriesController],
  providers: [],
})
export class MoodModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
