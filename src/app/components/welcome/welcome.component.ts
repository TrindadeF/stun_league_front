import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { AuthService } from '../../services/auth/auth.service';
import { MatchService } from '../../services/match/match.service';


@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  isContainerLoginVisible = false


  constructor(private router: Router, private auth: AuthService, private matchService: MatchService){}
  ngOnInit() {

  }

  navigate() {
    this.matchService.isInMatch();
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl("/home")
    }
  }


  toggleContainer() {
    this.isContainerLoginVisible = true;
  }

}


