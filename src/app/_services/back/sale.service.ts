import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { Sale, SaleOrder } from '../../_models/sale';

@Injectable({
  providedIn: 'root',
})
export class SaleService extends BaseApiService {
  protected override apiUrl = 'sale';

  public getItems(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.baseUrl}/${this.apiUrl}/admin/list`);
  }

  public sort(order: SaleOrder[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${this.apiUrl}/sort`, order);
  }
}
