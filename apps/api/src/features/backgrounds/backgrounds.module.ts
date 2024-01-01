import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../../middlewares/app.middleware';
import { BackgroundsController } from './controllers/backgrounds.controller';

@Module({
  imports: [],
  controllers: [BackgroundsController],
  providers: [],
})
export class BackgroundsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
