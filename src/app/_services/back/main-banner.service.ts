import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SortOrder } from '../front/sort-order.service';

@Injectable({
  providedIn: 'root',
})
export class MainBannerService {
  protected baseUrl = environment.baseUrl;

  protected apiUrl: string = 'main';

  constructor(protected http: HttpClient) {}

  public updateItem<T>(item: T): Observable<any> {
    return this.http.post<string>(`${this.baseUrl}/${this.apiUrl}`, item);
  }

  public setOrder(order: SortOrder[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/sort`, order);
  }
}
