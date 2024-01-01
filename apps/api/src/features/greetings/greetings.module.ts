import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../../middlewares/app.middleware';
import { GreetingsController } from './controllers/greetings.controller';

@Module({
  imports: [],
  controllers: [GreetingsController],
  providers: [],
})
export class GreetingsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
