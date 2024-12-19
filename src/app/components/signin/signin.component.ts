import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { RequestsService } from '../../services/requests/requests.service';
import { UserRequestLoginDTO } from '../../models/UserRequestLoginDTO';
import e from 'express';
import { FormsModule } from '@angular/forms';
import { AuthenticationResponseDTO } from '../../models/AuthenticationResponseDTO';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent, FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {

  userRequestLoginDTO = new UserRequestLoginDTO();

  errorMessage = "";
  constructor(
    private req: RequestsService,
    private cookieService: CookieService,
    private router: Router
  )

    {}

  login() {
    this.errorMessage = "";
    console.log(this.userRequestLoginDTO);
    this.req.post<AuthenticationResponseDTO>("/v1/authenticate", this.userRequestLoginDTO)
      .subscribe(
        (data: AuthenticationResponseDTO) => {
          this.cookieService.set("token", data.token)
          this.cookieService.set("username", data.username)
          this.cookieService.set("email", data.email)
          this.cookieService.set("name", data.name)
          this.cookieService.set("imageProfile", data.imageProfile)
          this.cookieService.set("expirationToken", data.expiration.toString())
          this.cookieService.set("id", data.userId.toString())

          this.cookieService.set("match-Id", data.playerInformationsDTO.matchId)
          this.cookieService.set("queue-id", data.playerInformationsDTO.queueId)

          this.router.navigateByUrl("/home")
        },
        (error) => {
          console.log(error);
          console.log(error)
          this.cookieService.deleteAll()
          this.errorMessage = "Usuário inválido!"
        }
      );
  }
}