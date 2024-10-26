import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class MediaService extends BaseApiService {
  protected override apiUrl = 'media';
}
