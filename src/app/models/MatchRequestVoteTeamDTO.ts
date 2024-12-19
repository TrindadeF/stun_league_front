import { TeamNames } from "../utils/enums/TeamNames";

export class MatchRequestVoteTeamDTO {
    matchId: string = '';
    teamName!: TeamNames
    playerId!: number;
    constructor(matchId: string,teamName: TeamNames, playerId: number) {
        this.matchId = matchId;
        this.teamName = teamName;
        this.playerId = playerId;
    }
}