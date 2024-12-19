export class MatchRequestDTO {
    matchId: string = '';
    playerId!: number;
    constructor(matchId: string, playerId: number) {
        this.matchId = matchId;
        this.playerId = playerId;
    }
}