import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, switchMap, filter } from 'rxjs/operators';
import { TokenService } from '../_services/front/token.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private tokenService: TokenService) {}

  public intercept(req: HttpRequest<{}>, next: HttpHandler): Observable<HttpEvent<{}>> {
    if (req.url.includes('back/')) {
      let params = req;
      const token = this.tokenService.getToken();
      if (token) {
        params = this.addToken(req, token);
      }
      return next.handle(params);
      //   .pipe(
      //   catchError((error) => {
      //     if (error.status === 0) {
      //       return of(error);
      //     }
      //     if (
      //       error instanceof HttpErrorResponse &&
      //       error.status === 401 &&
      //       this.tokenService.getRefreshToken()
      //     ) {
      //       return this.handle401Error(params, next);
      //     }
      //     return throwError(error);
      //   }),
      // );
    }
    return next.handle(req);
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!this.isRefreshing && refreshToken) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.tokenService.refreshToken(refreshToken).pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.jwt);
          return next.handle(this.addToken(request, token.jwt));
        }),
      );
    }
    return this.refreshTokenSubject.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((jwt) => {
        return next.handle(this.addToken(request, jwt));
      }),
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
