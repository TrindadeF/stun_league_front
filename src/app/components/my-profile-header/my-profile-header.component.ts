import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-profile-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-profile-header.component.html',
  styleUrls: ['./my-profile-header.component.css']
})
export class MyProfileHeaderComponent {
  public imageProfileUrl!: string;
  public username: string = "";
  public name: string = "";
  private playerId!: number;
  public haveYtInfo: boolean = true;
  public haveInstaInfo: boolean = true;
  public currentRoute: string = '';

  constructor(
    private cookie: CookieService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.currentRoute = this.router.url;
    this.imageProfileUrl = this.cookie.get("imageProfile") ?? "";
    this.username = this.cookie.get("username") ?? "";
    this.name = this.cookie.get("name") ?? "";
    this.playerId = Number(this.cookie.get("id"));
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }
}
