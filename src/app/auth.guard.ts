import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService) {}

  async canActivate(): Promise<boolean> {
    if (this.authService.isAuthen()) {
      return true;
    } else {
      return false;
    }
  }
}
