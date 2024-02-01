import { Module, OnApplicationShutdown } from '@nestjs/common';

import { destroyDatabase } from '@moaitime/database-core';

import { AppController } from './controllers/app.controller';
import { AuthModule } from './features/auth/auth.module';
import { BackgroundsModule } from './features/backgrounds/backgrounds.module';
import { CalendarsModule } from './features/calendar/calendar.module';
import { FocusModule } from './features/focus/focus.module';
import { GreetingsModule } from './features/greetings/greetings.module';
import { MoodModule } from './features/mood/mood.module';
import { NotesModule } from './features/notes/notes.module';
import { QuotesModule } from './features/quotes/quotes.module';
import { StatisticsModule } from './features/statistics/statistics.module';
import { TasksModule } from './features/tasks/tasks.module';
import { TestingModule } from './features/testing/testing.module';
import { WeatherModule } from './features/weather/weather.module';
import { WebsocketGateway } from './gateways/websocket.gateway';

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
    MoodModule,
    FocusModule,
    StatisticsModule,
    TestingModule,
  ],
  controllers: [AppController],
  providers: [WebsocketGateway],
})
export class AppModule implements OnApplicationShutdown {
  async onApplicationShutdown() {
    await destroyDatabase();
  }
}
