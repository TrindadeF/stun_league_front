import { UserConfigurationDTO } from "./UserConfigurationDTO";
import { UserSocialMediaDTO } from "./UserSocialMediaDTO";

export class UserResponseDTO {
    username: string = '';
    name: string = '';
    email: string = '';
    birthDate!: Date;
    userSocialMedias!: UserSocialMediaDTO[];
    userConfigurations!: UserConfigurationDTO[];

}