import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate(): Promise<boolean> {
    if (await this.authService.isAuthen()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
