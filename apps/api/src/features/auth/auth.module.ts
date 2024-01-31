import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AccountController } from './controllers/account.controller';
import { AuthController } from './controllers/auth.controller';
import { JoinedTeamController } from './controllers/joined-team.controller';
import { MyTeamUserInvitationsController } from './controllers/my-team-user-invitations.controller';
import { TeamUserInvitationsController } from './controllers/team-user-invitations.controller';
import { TeamsController } from './controllers/teams.controller';
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
  ],
  providers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
