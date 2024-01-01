import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../../middlewares/app.middleware';
import { TestingController } from './controllers/testing.controller';

@Module({
  imports: [],
  controllers: [TestingController],
  providers: [],
})
export class TestingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
