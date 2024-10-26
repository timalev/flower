import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { Observable } from 'rxjs';
import { IdImg } from '../../_models/_idImg';

@Injectable({
  providedIn: 'root',
})
export class ContactsService extends BaseApiService {
  protected override apiUrl = 'contact-photo';

  public getPhotos(): Observable<IdImg[]> {
    return this.http.get<IdImg[]>(`${this.baseUrl}/${this.apiUrl}s`);
  }
}
