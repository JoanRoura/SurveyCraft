import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService]
})
export class LoginComponent {

  loginForm: FormGroup;
  loading: boolean = false;

  // ? Patterns per controla el username i el passwoord
  usernamePattern: string = '([a-zA-Z]+) ([a-zA-Z]+)';
  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {

    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      password: [null, Validators.required]
    });
  }

  invalidCamp(campo: string) {
    return this.loginForm.get(campo)?.invalid
      && this.loginForm.get(campo)?.touched
  }

  getClassCSS(campo: string): string {
    return (this.loginForm.get(campo)?.invalid && this.loginForm.get(campo)?.touched)
      ? "ng-invalid ng-dirty"
      : "";
  }

  get emailErrorMsg(): string {
    const errors = this.loginForm.get('email')?.errors;

    if (errors?.['required']) {
      return 'Email required';
    } else if (errors?.['pattern']) {
      return 'Invalid email';
    }

    return '';
  }

  get passwordErrorMsg(): string {
    const errors = this.loginForm.get('password')?.errors;

    if (errors?.['required']) {
      return 'Password required';
    }

    return '';
  }

  login(): void {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    const userAuth = {
      email,
      password
    }

    this.loading = true;

    this.authService.login(userAuth).subscribe({
      next: (user) => {

        if (email === "admin@gmail.com" && password === "admin123") {
          this.router.navigate(['/admin/crud-user'])
        } else {
          this.router.navigate(['/survey/list-survey']);
        }
        
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: `User ${user.name} logged successful` });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login failed. Please try again.' });
        this.loading = false;
      }
    });
  }
}
