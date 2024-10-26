import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { DaDataBankEntity, DaDataClientEntity } from '../../_models/daDataEntity';

@Injectable({
  providedIn: 'root',
})
export class DadataService {
  private url: string = environment.dadataUrl;
  constructor(private http: HttpClient) {}

  public getFirmByINN(query: string): Observable<{ suggestions: DaDataClientEntity[] }> {
    return this.http.post<{ suggestions: DaDataClientEntity[] }>(this.url + '/findById/party', {
      query: query,
    });
  }

  public getBank(query: string): Observable<{ suggestions: DaDataBankEntity[] }> {
    return this.http.post<{ suggestions: DaDataBankEntity[] }>(this.url + '/suggest/bank', {
      query: query,
    });
  }
}
