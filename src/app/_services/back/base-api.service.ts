import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SortOrder } from '../front/sort-order.service';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  protected baseUrl = environment.baseUrl;

  protected apiUrl: string | undefined;

  constructor(protected http: HttpClient) {}

  public getItemById<T>(id: string | number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${this.apiUrl}/${id}`);
  }

  public addItem<T>(item: T): Observable<any> {
    return this.http.post<string>(`${this.baseUrl}/${this.apiUrl}`, item);
  }

  public updateItem<T extends { id?: string | number }>(
    item: T,
    id?: string | number,
  ): Observable<T> {
    let identifier = id;
    if (!identifier) {
      identifier = item.id;
      delete item.id;
    }
    return this.http.post<T>(`${this.baseUrl}/${this.apiUrl}/${identifier}`, item);
  }

  public deleteItem(id: string | number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.apiUrl}/${id}`);
  }

  public setOrder(order: SortOrder[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/sort`, order);
  }
}
