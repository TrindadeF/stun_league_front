import { PlayerResponseDTO } from "./PlayerResponseDTO"

export class MatchCancelRequestDTO {
    matchId!: string;
    playerResponseDTO!: PlayerResponseDTO;

    constructor(matchId: string, playerResponseDTO: PlayerResponseDTO) {
        this.matchId = matchId;
        this.playerResponseDTO = playerResponseDTO;
    }
}