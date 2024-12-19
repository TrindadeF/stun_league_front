import { Component, OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { RequestUpdateSocialMediaDTO } from "../../models/RequestUpdateSocialMediaDTO";
import { UserResponseDTO } from "../../models/UserResponseDTO";
import { RequestsService } from "../../services/requests/requests.service";
import { SOCIAL_MEDIA_LIST, SOCIAL_MEDIA_MAP } from "../../utils/utils";
import { MyProfileHeaderComponent } from "../my-profile-header/my-profile-header.component";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RequestUpdateConfigurationDTO } from "../../models/RequestUpdateConfigurationDTO";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RequestUpdateUserInformationDTO } from "../../models/RequestUpdateUserInformationDTO";
import { UserConfigurationDTO } from "../../models/UserConfigurationDTO";
import { RequestUpdateImageProfileDTO } from "../../models/RequestUpdateImageProfileDTO";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserService } from "../../services/user-services/user.service";

@Component({
  selector: 'app-my-profile-informations',
  standalone: true,
  imports: [MyProfileHeaderComponent, FormsModule, CommonModule, SidebarComponent],
  templateUrl: './my-profile-informations.component.html',
  styleUrls: ['./my-profile-informations.component.css']
})
export class MyProfileInformationsComponent implements OnInit {
  public imageProfileUrl!: string;
  public userId!: number;
  public userResponseDTO!: UserResponseDTO;
  
  public socialLinksHash: { [key: number]: string } = {};
  public socialMediaList = SOCIAL_MEDIA_LIST;
  public socialMediaMap = SOCIAL_MEDIA_MAP;
  public requestUpdateUserInformationDTO: RequestUpdateUserInformationDTO = new RequestUpdateUserInformationDTO();

  mouseValue: string = '';
  dpiValue: string = '';
  keyboardValue: string = '';
  headsetValue: string = '';
  monitorValue: string = '';
  resolutionValue: string = '';

  CONFIGURATION_MAP: { [key: number]: string } = {
    1: this.mouseValue,
    2: this.keyboardValue,
    3: this.dpiValue,
    4: this.headsetValue,
    5: this.resolutionValue,
    6: this.monitorValue,
  };

  imageSrc: string | ArrayBuffer | null = null;


  errorsValidation: string = '';

  constructor(
    private cookieService: CookieService,
    private reqService: RequestsService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {

    this.userId = Number(this.cookieService.get("id"));
    this.imageProfileUrl = this.cookieService.get("imageProfile") || "default-profile-image-url"; 

    this.reqService.get<UserResponseDTO>(`/v1/users/informations/${this.userId}`)
      .subscribe(
        (data: UserResponseDTO) => {
          this.userResponseDTO = data;
          this.initializeSocialLinks();
          console.log("USER CONFIGURATIONS: " + JSON.stringify(this.userResponseDTO.userConfigurations))
          console.log("PEGANDO VALOR DO USERS CONFIGURATIONS: " + this.userResponseDTO.userConfigurations.find(m => m.configurationId === 5)?.value ?? "");

        },
        (error) => {
          console.error("Erro ao obter informações do usuário:", error);
        }
      );

      try {
        this.imageSrc = await this.userService.getImageProfile();
      } catch (error) {
        console.error('Erro ao baixar imagem de perfil:', error);
      }
  }

  private initializeSocialLinks(): void {
    this.socialMediaList.forEach(media => {
      const userMedia = this.userResponseDTO.userSocialMedias.find(sm => sm.socialMediaId === media.id);
      this.socialLinksHash[media.id] = userMedia ? userMedia.value : '';
    });
  }

  public updateSocialLink(socialMediaId: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.trim();
    console.log("ID: " + socialMediaId)
    console.log("LINK: " + this.socialMediaMap[socialMediaId].baseUrl)


    if (value && !/^https?:\/\//i.test(value)) {
      value = this.socialMediaMap[socialMediaId].baseUrl + value;
    }

    this.socialLinksHash[socialMediaId] = value;
  }

  public updateSocialMedia(socialMediaId: number): void {
    const value = this.socialLinksHash[socialMediaId].trim();

    if (!value) {
      console.warn("Valor vazio para a rede social ID:", socialMediaId);
      return;
    }

    const request: RequestUpdateSocialMediaDTO = {
      userId: this.userId,
      socialMediaId: socialMediaId,
      value:  value
    };

    this.reqService.post<UserResponseDTO>('/v1/users/update-social-media', request)
      .subscribe(
        (data: UserResponseDTO) => {
          this.userResponseDTO = data;
          console.log("Rede social atualizada com sucesso:", data);
        },
        (error) => {
          console.error("Erro ao atualizar rede social:", error);
        }
      );

  }

  public getSocialMediaPlaceholder(socialMediaId: number): string {
    const media = this.socialMediaList.find(m => m.id === socialMediaId);
    return media ? media.baseUrl : 'https://';
  }

  
  public getUserConfigurationlaceholder(configurationId: number): string {
    return this.userResponseDTO.userConfigurations.find(m => m.configurationId === configurationId)?.value ?? "";
  }

  public getSocialMediaValue(socialMediaId: number): string {
    const media = this.userResponseDTO.userSocialMedias.find(sm => sm.socialMediaId === socialMediaId);
    return media ? media.value : '';
  }

  public updateConfiguration(configurationId: number) {
    const request: RequestUpdateConfigurationDTO = {
      userId: this.userId,
      configurationId: configurationId,
      value:  this.CONFIGURATION_MAP[configurationId]
    };

    console.log("ID CONFIGURAÇÃO: " + configurationId)
    console.log("VALOR CONFIGURAÇÃO: " + this.CONFIGURATION_MAP[configurationId])
    Object.keys(this.CONFIGURATION_MAP).forEach(key => {
      const value = this.CONFIGURATION_MAP[Number(key)];
      console.log(`Chave: ${key}, Valor: ${value}`);
    });

    this.reqService.post<UserResponseDTO>('/v1/users/update-configuration', request)
    .subscribe(
      (data: UserResponseDTO) => {
        this.userResponseDTO = data;
        console.log("Rede social atualizada com sucesso:", data);
      },
      (error) => {
        console.error("Erro ao atualizar rede social:", error);
      }
    );

  }

  public updateUserInformations() {
    console.log(JSON.stringify(this.requestUpdateUserInformationDTO))
    this.requestUpdateUserInformationDTO.userId = this.userId;
    this.reqService.post<UserResponseDTO>('/v1/users/update-user-informations', this.requestUpdateUserInformationDTO)
    .subscribe(
      (data: UserResponseDTO) => {
        this.userResponseDTO = data;
        if (this.userResponseDTO) {
          this.errorsValidation = '';
        }
      },
      (error) => {
        console.error("Erro ao atualizar rede social:", error);
        this.errorsValidation = error.error.details
        console.log("ERRO: " + this.errorsValidation)
      }
    );

    this.cookieService.deleteAll();

    
  }



  onImageChange(event: any): void {
    const file = event.target.files[0];
    const maxSizeKB = 100; // Define o tamanho máximo em kilobytes
    const maxSizeBytes = maxSizeKB * 1024;

    if (file.size > maxSizeBytes) {
      alert(`A imagem deve ser menor que ${maxSizeKB} KB.`);
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageProfileUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      const requestUpdateImageProfileDTO: RequestUpdateImageProfileDTO  = new RequestUpdateImageProfileDTO();
      requestUpdateImageProfileDTO.file = file;
      requestUpdateImageProfileDTO.userId = this.userId;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', this.userId.toString());

      this.reqService.post<string>('/v1/users/upload-profile-image', formData)
      .subscribe(
      (data: string) => {
        console.log(data)
      },
      (error) => {
        this.errorsValidation = error.error.details
        console.log("ERRO: " + this.errorsValidation)
      }
    );
    }
  }
}
