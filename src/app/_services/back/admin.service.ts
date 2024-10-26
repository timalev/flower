import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../front/token.service';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { TokensResponse } from '../../_models/tokens.response';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = environment.baseUrl;
  private isAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private authService: TokenService) {
    this.isAdmin.next(!!authService.getToken());
  }

  public signIn(data: any): Observable<any> {
    return this.http.post<TokensResponse>(`${this.baseUrl}/login`, data).pipe(
      tap((tokens: TokensResponse) => {
        this.authService.storeTokens(tokens);
        this.isAdmin.next(true);
      }),
    );
  }

  public logOut(): Observable<any> {
    const token = this.authService.getRefreshToken();
    return (
      token
        ? this.http.post<string>(`${this.baseUrl}/delete-token`, {
            token,
          })
        : of(null)
    ).pipe(
      // @ts-ignore
      tap(() => {
        this.authService.removeTokens();
        this.isAdmin.next(false);
      }),
    );
  }

  public checkAdmin(): Observable<boolean> {
    return this.isAdmin;
  }
}
