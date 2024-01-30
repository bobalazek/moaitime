import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AccountController } from './controllers/account.controller';
import { AuthController } from './controllers/auth.controller';
import { TeamUserInvitationsController } from './controllers/team-user-invitations.controller';
import { TeamsController } from './controllers/teams.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [],
  controllers: [AuthController, AccountController, TeamsController, TeamUserInvitationsController],
  providers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
