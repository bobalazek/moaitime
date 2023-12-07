import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { BackgroundsModule } from '../backgrounds/backgrounds.module';
import { EventsModule } from '../events/events.module';
import { GreetingsModule } from '../greetings/greetings.module';
import { QuotesModule } from '../quotes/quotes.module';
import { TasksModule } from '../tasks/tasks.module';
import { TestingModule } from '../testing/testing.module';
import { AppController } from './controllers/app.controller';
import { AppMiddleware } from './middlewares/app.middleware';

@Module({
  imports: [
    AuthModule,
    BackgroundsModule,
    GreetingsModule,
    QuotesModule,
    TasksModule,
    EventsModule,
    TestingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }
}
