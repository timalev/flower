import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class BannerSettingsService extends BaseApiService {
  public override apiUrl = 'sale/config';
}
