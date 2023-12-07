import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../core/middlewares/app.middleware';
import { ListsController } from './controllers/lists.controller';

@Module({
  imports: [],
  controllers: [ListsController],
  providers: [],
})
export class TasksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
