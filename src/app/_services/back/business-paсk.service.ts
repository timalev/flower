import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Firm, Individual } from '../../_models/business-pack/firm';
import { environment } from '../../../environments/environment';
import { GoodsBusinessPack } from '../../_models/business-pack/goods-base';
import { Invoice } from '../../_models/business-pack/invoice';
import { catchError } from 'rxjs/operators';

@Injectable()
export class BusinessPackService {
  private _selfId = '00~Pvjh00003';
  private _boxVolume = '00~Pvjh0000F';
  private _deliveryVolume = '00~Pvjh00Iyr';
  private baseId = environment.bpId;
  private baseUrl = `${environment.bpUrl}/${this.baseId}`;

  public get selfId(): string {
    return this._selfId;
  }

  public get boxVolume(): string {
    return this._boxVolume;
  }

  public get deliveryVolume(): string {
    return this._deliveryVolume;
  }

  public get boxId(): string {
    return '00~Pvjh01MMv';
  }

  public get deliveryId(): string {
    return '00~Pvjh01MMw';
  }

  constructor(private http: HttpClient) {}

  //------------------------ API Фирм -----------------------------//

  public searchFirm(query?: string): Observable<{ items: Firm[]; total_count: number }> {
    return this.http.get<{ items: Firm[]; total_count: number }>(
      `${this.baseUrl}/firm/search${query ? `?query=${encodeURIComponent(query)}` : `?query=test`}`,
    );
  }

  public createFirm(firm: Firm | Individual): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/firm`, firm);
  }

  public getFirmById(id: string): Observable<Firm> {
    return this.http.get<Firm>(`${this.baseUrl}/firm/${id}`);
  }

  public deleteFirm(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/firm/${id}`);
  }

  public updateFirm(firm: Firm): Observable<any> {
    const { Object } = firm;
    delete firm.Object;
    return this.http.post(`${this.baseUrl}/firm/${Object}`, firm);
  }

  //------------------------ API Счетов -----------------------------//

  public createInvoice(invoice: Invoice): Observable<any> {

	 // console.log(this.baseUrl + '/doc-invoice');

    return this.http.post<any>(`${this.baseUrl}/doc-invoice`, invoice);
  }

  public getInvoiceById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/doc-invoice/${id}`);
  }

  public deleteInvoice(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/doc-invoice/${id}`);
  }

  public sendInvoiceToTelepak(
    id: string,
    params: { report_name: string; send_with_stamp: boolean },
  ): Observable<{ id: string }> {


	  console.log(params);


	  this.http.post<{ id: string }>(`${this.baseUrl}/doc-invoice/${id}/send-telepak`, params)
	  
	  .pipe(catchError((error: any) => {
 
		 console.log(error.error.error.message);

		 return error.error.error.message;
         
        }))
      .subscribe((id) => {
       // alert(2);

		return "2";
      
      });
    
	
	return this.http.post<{ id: string }>(`${this.baseUrl}/doc-invoice/${id}/send-telepak`, params);

	

  }

  public getReport(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reports/doc-invoice`);
  }

  //------------------------ API Товаров -----------------------------//

  public searchGoods(query?: string): Observable<any> {
    return this.http.get<GoodsBusinessPack[]>(
      `${this.baseUrl}/model/search${query ? `?query=${encodeURIComponent(query)}` : ``}`,
    );
  }

  public createGoods(goods: GoodsBusinessPack): Observable<{ Object: string }> {
    return this.http.post<{ Object: string }>(`${this.baseUrl}/model`, goods);
  }

  public getGoodsById(id: string): Observable<GoodsBusinessPack> {
    return this.http.get<GoodsBusinessPack>(`${this.baseUrl}/model/${id}`);
  }

  public deleteGoods(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/model/${id}`);
  }

  public updateGoods(goods: GoodsBusinessPack): Observable<{ Object: string }> {
    const { Object } = goods;
    delete goods.Object;
    return this.http.post<{ Object: string }>(`${this.baseUrl}/model/${Object}`, goods);
  }

  public searchVolume(query?: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/volume/search${query ? `?query=${encodeURIComponent(query)}` : ``}`,
    );
  }
}
