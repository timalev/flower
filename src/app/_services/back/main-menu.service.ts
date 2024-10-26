import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainMenu, MainMenuItem } from '../../_models/static-data/main-menu';

@Injectable({
  providedIn: 'root',
})
export class MainMenuService {
  protected baseUrl = environment.baseUrl;

  protected apiUrl: string = 'menu-items';

  constructor(protected http: HttpClient) {}

  public getMenuItems(): Observable<MainMenu[]> {
    return this.http.get<MainMenu[]>(`${this.baseUrl}/${this.apiUrl}`);
  }

  public saveMenuItems(menu: MainMenuItem[]): Observable<MainMenu[]> {
    return this.http.post<MainMenu[]>(`${this.baseUrl}/${this.apiUrl}`, menu);
  }
}
