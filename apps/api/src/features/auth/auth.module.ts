import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { JoinedTeamController } from '../teams/controllers/joined-team.controller';
import { MyTeamUserInvitationsController } from '../teams/controllers/my-team-user-invitations.controller';
import { TeamUserInvitationsController } from '../teams/controllers/team-user-invitations.controller';
import { TeamsController } from '../teams/controllers/teams.controller';
import { AccountController } from './controllers/account.controller';
import { AuthController } from './controllers/auth.controller';
import { PingController } from './controllers/ping.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [],
  controllers: [
    AuthController,
    AccountController,
    TeamsController,
    TeamUserInvitationsController,
    JoinedTeamController,
    MyTeamUserInvitationsController,
    PingController,
  ],
  providers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
