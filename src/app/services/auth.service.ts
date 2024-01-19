import { Injectable } from '@angular/core';
import { AccountModel } from '../model/account.model';
import { Observable, Subject, catchError, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authen = false;

  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  register(account: AccountModel): Observable<AccountModel> {
    const url = `${this.baseUrl}/register`;
    return this.http.post<AccountModel>(url, account).pipe(
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return throwError(() => error);
      })
    );
  }

  login(account: any): Observable<any> {
    const url = `${this.baseUrl}/login`;
    return this.http.post<any>(url, account).pipe(
      tap(() => {
        this.authen = true;
      }),
      catchError((error: any) => {
        console.error('An error occurred:', error);
        return throwError(() => error);
      })
    );
  }

  logout() {
    this.authen = false;
  }

  isAuthen() {
    return this.authen;
  }
}
