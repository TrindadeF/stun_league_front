import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { RequestsService } from '../requests/requests.service';
import { Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookie: CookieService, private req: RequestsService, private router: Router) { }


  isAuthenticated() {
    const userId = this.cookie.get("id");

    if (!userId) {
      console.log("não tem")
      this.router.navigateByUrl("/signin");
      return of(false); 
    }

    return this.req.get("v1/users/" + userId).pipe(
      switchMap(() => of(true)), 
      catchError(() => {
        this.router.navigateByUrl("/signin");
        return of(false); 
      })
    );
  }
}
