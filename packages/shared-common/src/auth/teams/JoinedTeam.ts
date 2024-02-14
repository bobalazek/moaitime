import { Team } from './TeamSchema';
import { TeamUser } from './TeamUserSchema';

export type JoinedTeam = {
  team: Team;
  teamUser: TeamUser;
};
