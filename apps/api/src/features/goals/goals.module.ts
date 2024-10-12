import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../../middlewares/app.middleware';
import { GoalsController } from './controllers/goals.controller';

@Module({
  imports: [],
  controllers: [GoalsController],
  providers: [],
})
export class GoalsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
