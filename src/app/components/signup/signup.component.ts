import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { RequestsService } from '../../services/requests/requests.service';
import { UserDTO } from '../../models/UserDTO';
import { FormsModule } from '@angular/forms'; // Importe FormsModule
import { error } from 'console';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  errorMessagePassword = "";
  errorsValidation: { [key: string]: string } = {};
  sucessMessage = "";
  userDto: UserDTO = new UserDTO();
  isSubmitting = false;

  
  constructor(private req: RequestsService, private router: Router, private cookie: CookieService) {}

  ngOnInit() {
    this.cookie.deleteAll();
  }
  submit() {
    this.errorsValidation = {};
    if (this.userDto.password != this.userDto.confirmPassword) {
      this.errorMessagePassword = "Senhas não correspondem"
      return;
    }
    this.errorMessagePassword = ""
    this.sucessMessage = ""
    console.log('teste')
    console.log("DATA DE NASCIMENTO: " + this.userDto.birthDate)
    this.isSubmitting = true;
    this.req.post("v1/users/register", this.userDto)
    .subscribe((data) => {
      this.sucessMessage = "Sucesso!";
      setTimeout(() => {
        this.router.navigateByUrl("/signin");
      }, 5000);
    }, (error) => {
      console.log(error)
      this.errorsValidation = error.error
      console.log(this.errorsValidation)
      this.isSubmitting = false;
    });
  }
}

