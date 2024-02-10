import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../../middlewares/app.middleware';
import { FeedbackEntriesController } from './controllers/feedback-entries.controller';

@Module({
  imports: [],
  controllers: [FeedbackEntriesController],
  providers: [],
})
export class SettingsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
