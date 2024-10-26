import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { ProductOrder } from '../../_models/product-order';
import { Order } from '../../_models/order';
import { Product } from '../../_models/product';
import { PopularOrder } from '../../_models/popular-order';
import { SortOrder } from '../front/sort-order.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseApiService {
  protected override apiUrl = 'product';

  public search<T>(searchString: string): Observable<T> {
    return this.http.get<T>(
      `${this.baseUrl}/${this.apiUrl}/list?searchString=${encodeURI(searchString)}`,
    );
  }

  public setProductsOrder(order: ProductOrder[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/order`, order);
  }

  public setPopularOrder(order: PopularOrder[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/order-popular`, order);
  }

  public sendOrder(order: Order): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/send-order`, order);
  }

  public getItems(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/${this.apiUrl}/list`);
  }

  public override setOrder(order: SortOrder[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.apiUrl}/sort-photos`, order);
  }
}
