import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RequestsService } from '../services/requests/requests.service';
import { map, catchError, of } from 'rxjs';

export const antCheaterGuard: CanActivateFn = (route, state) => {
  const cookie = inject(CookieService);
  const req = inject(RequestsService);
  const router = inject(Router);

  return req.get<boolean>(`/v1/players/in-ant-cheater-screen/${cookie.get('id')}`).pipe(
    map((data: boolean) => {
      console.log(data)
      if (data === true) {
        return true;
      } else {
        router.navigateByUrl('/home');
        return false;
      }
    }),
    catchError((error) => {
      console.error('Error checking queue status', error);
      router.navigateByUrl('/home');
      return of(false);
    })
  );
};
