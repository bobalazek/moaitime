import { Module, OnApplicationShutdown } from '@nestjs/common';

import { destroyDatabase } from '@moaitime/database-core';
import { logger } from '@moaitime/logging';
import { getEnv } from '@moaitime/shared-backend';

import { AppController } from './controllers/app.controller';
import { AuthModule } from './features/auth/auth.module';
import { BackgroundsModule } from './features/backgrounds/backgrounds.module';
import { CalendarsModule } from './features/calendar/calendar.module';
import { FocusModule } from './features/focus/focus.module';
import { GoalsModule } from './features/goals/goals.module';
import { GreetingsModule } from './features/greetings/greetings.module';
import { HabitsModule } from './features/habits/habits.module';
import { MoodModule } from './features/mood/mood.module';
import { NotesModule } from './features/notes/notes.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import { QuotesModule } from './features/quotes/quotes.module';
import { SettingsModule } from './features/settings/settings.module';
import { SocialModule } from './features/social/social.module';
import { StatisticsModule } from './features/statistics/statistics.module';
import { TasksModule } from './features/tasks/tasks.module';
import { TeamsModule } from './features/teams/teams.module';
import { TestingModule } from './features/testing/testing.module';
import { WeatherModule } from './features/weather/weather.module';
import { WebsocketModule } from './websocket/websocket.module';

const { NODE_ENV } = getEnv();

@Module({
  imports: [
    ...[
      AuthModule,
      TeamsModule,
      BackgroundsModule,
      GreetingsModule,
      NotesModule,
      QuotesModule,
      TasksModule,
      HabitsModule,
      GoalsModule,
      CalendarsModule,
      WeatherModule,
      MoodModule,
      FocusModule,
      SocialModule,
      StatisticsModule,
      NotificationsModule,
      SettingsModule,
      WebsocketModule,
    ],
    ...(NODE_ENV === 'test' ? [TestingModule] : []),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements OnApplicationShutdown {
  async onApplicationShutdown() {
    logger.info('[AppModule] Shutting down the app ...');

    await destroyDatabase();

    logger.info('[AppModule] App has been shut down');
  }
}
