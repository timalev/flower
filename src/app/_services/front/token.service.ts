import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { refreshTokenKey, tokenKey } from '../../_utils/constants';
import { TokensResponse } from '../../_models/tokens.response';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public getRefreshToken() {
    return localStorage.getItem(refreshTokenKey);
  }

  public getToken() {
    return localStorage.getItem(tokenKey);
  }

  public storeTokens(tokens: TokensResponse) {
    localStorage.setItem(tokenKey, tokens.token);
    localStorage.setItem(refreshTokenKey, tokens.refreshToken);
  }

  public removeTokens() {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(refreshTokenKey);
  }

  public refreshToken(token: string): Observable<TokensResponse> {
    return this.http.post<TokensResponse>(`${this.baseUrl}/refresh-token`, { token }).pipe(
      tap((tokens: TokensResponse) => {
        this.storeTokens(tokens);
      }),
    );
  }
}
