import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

  public setItem<T>(key: string, item: T): void {
    sessionStorage.setItem(key, JSON.stringify(item));
    this._storage.next(this.getItem<T>(key));
  }

  public getItem<T>(key: string): T | null {
    const item = sessionStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }

  public addItem<T>(key: string, item: T) {
    let storageItems = [];
    const storageString = sessionStorage.getItem(key);
    if (storageString) {
      storageItems = JSON.parse(storageString);
      storageItems.push(item);
      sessionStorage.setItem(key, JSON.stringify(storageItems));
    } else {
      storageItems.push(item);
      sessionStorage.setItem(key, JSON.stringify(storageItems));
    }
    this._storage.next(this.getItem<T>(key));
  }
  public editItem<T extends { id?: number }>(key: string, item: T) {
    let storageItems = [];
    const storageString = sessionStorage.getItem(key);
    if (storageString) {
      storageItems = JSON.parse(storageString);
      const index = storageItems.findIndex((val: T) => val.id === item.id);
      if (index) storageItems[index] = item;
      sessionStorage.setItem(key, JSON.stringify(storageItems));
      this._storage.next(this.getItem<T>(key));
    }
  }
  public removeItem<T extends { id?: number }>(key: string, id: number | string) {
    let storageItems = [];
    const storageString = sessionStorage.getItem(key);
    if (storageString) {
      storageItems = JSON.parse(storageString);
      const index = storageItems.findIndex((val: T) => val.id === id);
      if (index) storageItems.splice(index, 1);
      sessionStorage.setItem(key, JSON.stringify(storageItems));
      this._storage.next(this.getItem<T>(key));
    }
  }
  public storageUpdated<T>(): Observable<T> {
    return this._storage.asObservable();
  }
}
