import { Injectable } from '@angular/core';
import { AccountModel } from '../model/account.model';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authen: boolean = false;

  private jwtHelper: JwtHelperService = new JwtHelperService();
  private tokenExpirationCheckInterval: any;
  private inactivityTimeout: any;
  private inactivityDuration = 15 * 60 * 1000; // 30 minutes;

  private baseUrl = 'http://localhost:5000';

  constructor(
    private http: HttpClient,
    private storeService: StorageService,
    private router: Router
  ) {
    this.initTokenExpirationCheck();
  }

  public initInactivityTimer(): void {
    document.addEventListener(
      'mousemove',
      this.resetInactivityTimer.bind(this)
    );
    document.addEventListener('click', this.resetInactivityTimer.bind(this));
    document.addEventListener('keydown', this.resetInactivityTimer.bind(this));
    this.resetInactivityTimer();
  }

  public async initToken(): Promise<void> {
    if (await this.checkToken()) {
      this.authen = true;
      if (this.isAuthen()) {
        this.router.navigateByUrl('/home');
      }
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  private resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.logout();
    }, this.inactivityDuration);
  }

  private initTokenExpirationCheck(): void {
    this.tokenExpirationCheckInterval = setInterval(() => {
      this.checkTokenExpiration();
    }, 60000); // Check every minute, adjust as needed
  }

  private async checkTokenExpiration(): Promise<void> {
    console.log('checking');
    try {
      const token = await this.storeService.get('token');

      if (token && this.jwtHelper.isTokenExpired(token)) {
        // Token has expired, initiate logout
        this.logout();
      }
    } catch (error) {
      console.error('Error checking token expiration:', error);
    }
  }

  public register(account: AccountModel): Observable<AccountModel> {
    const url = `${this.baseUrl}/register`;
    return this.http.post<AccountModel>(url, account).pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return throwError(() => error);
      })
    );
  }

  public login(account: any): Observable<any> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<any>(url, account).pipe(
      tap((res) => {
        if (res.token) {
          this.storeService.set('token', res.token);
          this.authen = true;
          if (this.authen) {
            this.router.navigateByUrl('/home');
          }
        }
      }),
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return throwError(() => error);
      })
    );
  }

  public logout() {
    this.storeService.remove('token');
    this.authen = false;
    this.checkToken().then((bool) => {
      if (!this.authen && !bool) {
        this.router.navigateByUrl('/login');
      }
    });
  }

  public setAuthen(value: boolean) {
    this.authen = value;
  }

  public isAuthen() {
    return this.authen;
  }

  private async checkToken(): Promise<boolean> {
    const token = await this.storeService.get('token');
    if (token) {
      return true;
    } else {
      return false;
    }
  }
}
