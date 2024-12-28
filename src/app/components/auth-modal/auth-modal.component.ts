import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],
})
export class AuthModalComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AuthModalComponent>,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  login(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.authService.login(loginData).subscribe((response) => {
        if (response.success) {
          alert(response.message);
          this.close();
        } else {
          alert(response.message);
        }
      });
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  }

  register(): void {
    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;

      if (registerData.password !== registerData.confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }

      this.authService.register(registerData).subscribe({
        next: (result) => {
          if (result.success) {
            alert(result.message);
            this.close();
          } else {
            alert(result.message);
          }
        },
        error: (err) => {
          console.error('Erro durante o registro:', err);
          alert('Erro durante o registro.');
        },
      });
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  }
}
