import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { Discount } from '../../_models/discount';

@Injectable({
  providedIn: 'root',
})
export class DiscountService extends BaseApiService {
  protected override apiUrl = 'discount';

  public getItems(): Observable<Discount[]> {
    return this.http.get<Discount[]>(`${this.baseUrl}/${this.apiUrl}/list`);
  }
}
