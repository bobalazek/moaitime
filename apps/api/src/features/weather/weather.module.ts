import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppMiddleware } from '../core/middlewares/app.middleware';
import { WeatherController } from './controllers/weather.controller';

@Module({
  imports: [],
  controllers: [WeatherController],
  providers: [],
})
export class WeatherModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
