import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RequestsService } from '../services/requests/requests.service';

@Injectable({
  providedIn: 'root'
})
export class QueueGuard implements CanActivate {

  constructor(
    private router: Router,
    private req: RequestsService,
    private cookie: CookieService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.req.get<boolean>(`/v1/players/in-queue-waiting-screen/${this.cookie.get('id')}`).pipe(
      map((data: boolean) => {
        if (data) {
          return true;
        } else {
          this.router.navigate(['/home']);
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error checking queue status', error);
        this.router.navigate(['/home']);
        return of(false);
      })
    );
  }
}
