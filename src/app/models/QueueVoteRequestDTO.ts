export class QueueVoteRequestDTO {
    nameMap: string = '';
    queueId: string = '';
    constructor(nameMap: string, queueId: string) {
        this.nameMap = nameMap;
        this.queueId = queueId;
    }
}