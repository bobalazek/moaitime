import { MiddlewareConsumer, Module, NestModule, OnApplicationShutdown } from '@nestjs/common';

import { destroyDatabase } from '@moaitime/database-core';

import { AuthModule } from '../auth/auth.module';
import { BackgroundsModule } from '../backgrounds/backgrounds.module';
import { CalendarsModule } from '../calendar/calendar.module';
import { GreetingsModule } from '../greetings/greetings.module';
import { NotesModule } from '../notes/notes.module';
import { QuotesModule } from '../quotes/quotes.module';
import { TasksModule } from '../tasks/tasks.module';
import { TestingModule } from '../testing/testing.module';
import { WeatherModule } from '../weather/weather.module';
import { AppController } from './controllers/app.controller';
import { AppMiddleware } from './middlewares/app.middleware';

@Module({
  imports: [
    AuthModule,
    BackgroundsModule,
    GreetingsModule,
    NotesModule,
    QuotesModule,
    TasksModule,
    CalendarsModule,
    WeatherModule,
    TestingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule, OnApplicationShutdown {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes('*');
  }

  async onApplicationShutdown() {
    await destroyDatabase();
  }
}
