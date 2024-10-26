import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root',
})
export class VideoService extends BaseApiService {
  protected override apiUrl = 'video';
}
