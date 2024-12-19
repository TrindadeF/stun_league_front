import { UUID } from "crypto";

export class QueueResponseTopicsDTO {

    queueId!: UUID;
    quantityPlayers!: number;
    quantityPlayersConfirmedInQueue!: number;
    mapsVotes!:  {}
    mapWinner!: string;
    matchId!: UUID;

    playersNamesInQueue!: []
}