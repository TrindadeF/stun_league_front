import { Injectable } from '@angular/core';
import { RequestsService } from '../requests/requests.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(private req: RequestsService, private cookie: CookieService, private router: Router) { }

  public isInMatch() {
    const playerId = this.cookie.get("id");
    if (playerId != null) {
      this.req.get<boolean>(`v1/players/in-match-screen/${playerId}`)
      .subscribe((data: boolean) => {
        if (data) {
          this.router.navigateByUrl("/match");
        }
      })
    }

  }
}
