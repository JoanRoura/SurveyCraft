import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // El usuario está autenticado, permite el acceso a la ruta
    } else {
      this.router.navigate(['/auth/login']); // Redirige al usuario a la página de inicio de sesión
      return false; // Evita el acceso a la ruta
    }
  }
}
