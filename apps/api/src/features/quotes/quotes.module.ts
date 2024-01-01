import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../../middlewares/app.middleware';
import { QuotesController } from './controllers/quotes.controller';

@Module({
  imports: [],
  controllers: [QuotesController],
  providers: [],
})
export class QuotesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
