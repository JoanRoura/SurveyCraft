import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { log } from 'console';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

  loading: boolean = false;

  registerForm: FormGroup;

  // Patterns
  namePattern: string = '([a-zA-Z]+)';
  emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService) {

    this.registerForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(this.namePattern)]],
      email: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      city: [null, Validators.required],
    });
  }

  invalidCamp(campo: string) {
    return this.registerForm.get(campo)?.invalid
      && this.registerForm.get(campo)?.touched
  }

  getClassCSS(campo: string): string {
    return (this.registerForm.get(campo)?.invalid && this.registerForm.get(campo)?.touched)
      ? "form-control is-invalid"
      : "form-control";
  }

  get nameErrorMsg(): string {
    const errors = this.registerForm.get('name')?.errors;

    if (errors?.['required']) {
      return 'Name is required.';
    } else if (errors?.['pattern']) {
      return 'Invalid format.';
    }

    return '';
  }

  get emailErrorMsg(): string {
    const errors = this.registerForm.get('email')?.errors;

    if (errors?.['required']) {
      return 'Email is required.';
    } else if (errors?.['pattern']) {
      return 'Email format.';
    }

    return '';
  }

  get passwordErrorMsg(): string {
    const errors = this.registerForm.get('password')?.errors;

    if (errors?.['required']) {
      return 'Password is required.';
    } else if (errors?.['minlength']) {
      return 'Password must be 8 characters.';
    }

    return '';
  }

  get cityErrorMsg(): string {
    const errors = this.registerForm.get('city')?.errors;

    if (errors?.['required']) {
      return 'City is required.';
    } else if (errors?.['pattern']) {
      return 'Invalid format.';
    }

    return '';
  }

  register() {

    const name = this.registerForm.value.name;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const city = this.registerForm.value.city;

    const userAuth = {
      name,
      email,
      password,
      city
    }

    this.authService.register(userAuth).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Successfully registered user', life: 3000 });
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Register failed. Please try again.' });
        this.loading = false;
      }
    });
  }
}
