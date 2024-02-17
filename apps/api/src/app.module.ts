import { Module, OnApplicationShutdown } from '@nestjs/common';

import { destroyDatabase } from '@moaitime/database-core';
import { logger } from '@moaitime/logging';
import { getEnv } from '@moaitime/shared-backend';

import { AppController } from './controllers/app.controller';
import { ConfigController } from './controllers/config.controller';
import { AuthModule } from './features/auth/auth.module';
import { BackgroundsModule } from './features/backgrounds/backgrounds.module';
import { CalendarsModule } from './features/calendar/calendar.module';
import { FocusModule } from './features/focus/focus.module';
import { GreetingsModule } from './features/greetings/greetings.module';
import { MoodModule } from './features/mood/mood.module';
import { NotesModule } from './features/notes/notes.module';
import { QuotesModule } from './features/quotes/quotes.module';
import { SettingsModule } from './features/settings/settings.module';
import { SocialModule } from './features/social/social.module';
import { StatisticsModule } from './features/statistics/statistics.module';
import { TasksModule } from './features/tasks/tasks.module';
import { TestingModule } from './features/testing/testing.module';
import { WeatherModule } from './features/weather/weather.module';
import { WebsocketModule } from './websocket/websocket.module';

const { NODE_ENV } = getEnv();

@Module({
  imports: [
    ...[
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
      SocialModule,
      StatisticsModule,
      SettingsModule,
    ],
    // Websockets not working fr testing... great job NestJS
    // https://github.com/nestjs/docs.nestjs.com/issues/97
    ...(NODE_ENV !== 'test' ? [WebsocketModule] : []),
    ...(NODE_ENV === 'test' ? [TestingModule] : []),
  ],
  controllers: [AppController, ConfigController],
  providers: [],
})
export class AppModule implements OnApplicationShutdown {
  async onApplicationShutdown() {
    logger.info('[AppModule] Shutting down the app ...');

    await destroyDatabase();

    logger.info('[AppModule] App has been shut down');
  }
}
