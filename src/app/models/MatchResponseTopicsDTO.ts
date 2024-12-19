import { UUID } from "crypto";
import { BlackKey } from "./BlackKey";
import { TeamsMatch } from "./TeamsMatch";
import { VotesTeam } from "./VotesTeam";
import { TeamNames } from "../utils/enums/TeamNames";

export class MatchResponseTopicsDTO {

    matchId!: UUID;
    quantityPlayers!: number;
    quantityPlayersConfirmedToStart!: number;
    votesAbort!: number;
    teams!: TeamsMatch
    voteTeamWinner!: {}
    teamWinner!: TeamNames;
    blackKey!: BlackKey;
    mapGame!: string;
    votesTeam!: VotesTeam;


}