import { PlayerInformationsDTO } from "./PlayerInformationsDTO";

export class AuthenticationResponseDTO {
    userId!: number;
    playerId!: number;
    name: string = '';
    username: string = '';
    email: string = '';
    token: string = '';
    imageProfile: string = ';'
    expiration: Date = null!;
    playerInformationsDTO!: PlayerInformationsDTO;
}