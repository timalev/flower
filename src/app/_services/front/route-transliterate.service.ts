import { Injectable } from '@angular/core';
import { transliterate } from 'transliteration';

@Injectable({
  providedIn: 'root',
})
export class RouteTransliterateService {
  public get currentRoute(): string {
    return this._currentRoute;
  }
  private _currentRoute = '';
  public transliterate(route: string): string {
    this._currentRoute = route;
    return transliterate(route.toLowerCase(), {
      replaceAfter: [[' ', '-']],
    });
  }
}
