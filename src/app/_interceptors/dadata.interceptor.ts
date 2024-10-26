import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class DadataInterceptor implements HttpInterceptor {
  private daDataToken = '697bd6880d6b939e90a17a98720f094bf0a71815';

  public intercept(request: HttpRequest<{}>, next: HttpHandler): Observable<HttpEvent<{}>> {
    if (request.url.includes(environment.dadataUrl)) {
      let params = request.clone({
        setHeaders: {
          Authorization: `Token ${this.daDataToken}`,
        },
        withCredentials: false,
      });
      return next.handle(params);
    }
    return next.handle(request);
  }
}
