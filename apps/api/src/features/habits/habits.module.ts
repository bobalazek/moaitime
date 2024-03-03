import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../../middlewares/app.middleware';
import { HabitsController } from './controllers/habits.controller';

@Module({
  imports: [],
  controllers: [HabitsController],
  providers: [],
})
export class HabitsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
