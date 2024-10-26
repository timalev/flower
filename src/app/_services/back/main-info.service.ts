import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainInfoService {
  protected baseUrl = environment.baseUrl;

  protected apiUrl: string = 'main-info';

  constructor(protected http: HttpClient) {}

  public getMainInfo<T>(): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${this.apiUrl}`);
  }
}
