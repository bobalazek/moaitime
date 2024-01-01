import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../../middlewares/app.middleware';
import { ListsController } from './controllers/lists.controller';
import { TasksController } from './controllers/tasks.controller';

@Module({
  imports: [],
  controllers: [TasksController, ListsController],
  providers: [],
})
export class TasksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
