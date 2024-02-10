import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../../middlewares/app.middleware';
import { ChangelogEntriesController } from './controllers/changelog-entries.controller';
import { FeedbackEntriesController } from './controllers/feedback-entries.controller';

@Module({
  imports: [],
  controllers: [FeedbackEntriesController, ChangelogEntriesController],
  providers: [],
})
export class SettingsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
