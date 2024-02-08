import { TeamUser } from './schemas/TeamUserSchema';
import { Team } from './TeamSchema';

export type JoinedTeam = {
  team: Team;
  teamUser: TeamUser;
};
