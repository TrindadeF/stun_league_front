import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { RequestsService } from '../requests/requests.service';
import { Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private cookie: CookieService,
    private req: RequestsService,
    private router: Router
  ) {}

  isAuthenticated() {
    const userId = this.cookie.get('id');

    if (!userId) {
      console.log('não tem');
      this.router.navigateByUrl('/signin');
      return of(false);
    }

    return this.req.get('v1/users/' + userId).pipe(
      switchMap(() => of(true)),
      catchError(() => {
        this.router.navigateByUrl('/signin');
        return of(false);
      })
    );
  }

  register(user: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    if (user.password !== user.confirmPassword) {
      console.error('As senhas não coincidem!');
      return of({ success: false, message: 'As senhas não coincidem!' });
    }

    return this.req
      .post('v1/authenticate/register', {
        username: user.username,
        email: user.email,
        password: user.password,
      })
      .pipe(
        switchMap((response) => {
          console.log('Registro bem-sucedido:', response);
          return of({ success: true, message: 'Registro bem-sucedido!' });
        }),
        catchError((error) => {
          console.error('Erro ao registrar:', error);
          return of({ success: false, message: 'Erro ao registrar!' });
        })
      );
  }

  login(credentials: { usernameOrEmail: string; password: string }) {
    return this.req.post('v1/authenticate/login', credentials).pipe(
      switchMap((response: any) => {
        console.log('Login bem-sucedido:', response);

        this.cookie.set('id', response.userId);
        this.cookie.set('token', response.token);
        this.cookie.set('username', response.username);

        this.router.navigateByUrl('/dashboard');

        return of({ success: true, message: 'Login bem-sucedido!' });
      }),
      catchError((error) => {
        console.error('Erro no login:', error);
        return of({ success: false, message: 'Erro ao realizar login!' });
      })
    );
  }
}
