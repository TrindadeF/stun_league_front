export class QueueRequestDTO {
    idQueue: string = '';
    idPlayer: number = 0;
    constructor(idQueue: string, idPlayer: number) {
        this.idQueue = idQueue;
        this.idPlayer = idPlayer;
    }
}