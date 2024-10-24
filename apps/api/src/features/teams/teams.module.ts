import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthMiddleware } from '../auth/middlewares/auth.middleware';
import { JoinedTeamController } from './controllers/joined-team.controller';
import { TeamUserInvitationsController } from './controllers/team-user-invitations.controller';
import { TeamsController } from './controllers/teams.controller';

@Module({
  imports: [],
  controllers: [TeamsController, TeamUserInvitationsController, JoinedTeamController],
  providers: [],
})
export class TeamsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
