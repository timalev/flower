import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MainMenu } from '../../_models/static-data/main-menu';

@Injectable({
  providedIn: 'root',
})
export class MainMenuUpdateService {
  private _isMenuUpdated: BehaviorSubject<MainMenu[] | null> = new BehaviorSubject<
    MainMenu[] | null
  >(null);

  public updated(): Observable<MainMenu[] | null> {
    return this._isMenuUpdated.asObservable();
  }

  public update(menu: MainMenu[]): void {
    this._isMenuUpdated.next([...menu]);
  }
}
