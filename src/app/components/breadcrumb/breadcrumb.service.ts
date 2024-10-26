import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, map, Observable, Subject } from 'rxjs';
import { slugify } from 'transliteration';
import { Category } from '../../_models/category';

interface BreadcrumbItem {
  title: string;
  routerLink: string[];
}

@Injectable()
export class BreadcrumbService {
  private url: string = '/';
  private _startUrl: string = '';
  private setUrlDuplicate: boolean = false;
  public backgroundChanges: Subject<'light' | 'dark'> = new Subject<'light' | 'dark'>();
  private _initItems = [
    {
      title: 'Главная',
      routerLink: [''],
    },
  ];
  private items: BreadcrumbItem[] = [];
  private _breadCrumbUpdate: BehaviorSubject<any> = new BehaviorSubject<any>(this.items);

  private _background: 'light' | 'dark' = 'light';

  public set background(value: 'light' | 'dark') {
    if (!this.setUrlDuplicate) {
      this._background = value;
      this.backgroundChanges.next(value);
    }
  }

  public get background(): 'light' | 'dark' {
    return this._background;
  }

  public get startUrl(): string {
    return this._startUrl;
  }

  public set startUrl(value: string) {
    if (value !== this._startUrl) {
      this.setUrlDuplicate = false;
      this._startUrl = value;
    } else {
      this.setUrlDuplicate = true;
    }
  }

  constructor(private router: Router) {
    router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => e as NavigationEnd),
      )
      .subscribe((event) => {
        this.url = event.urlAfterRedirects;
      });
  }

  public get isShow(): boolean {
    switch (this.url) {
      case '/':
        return false;
      case '/sign-in':
        return false;
      default:
        return !(
          this.url.includes('/#') ||
          this.url.includes('/admin') ||
          this.url.includes('/cart/download-invoice')
        );
    }
  }

  public setItem(title: string): void {
    this._breadCrumbUpdate.next([
      ...this._initItems,
      {
        title: title,
        routerLink: [''],
      },
    ]);
  }

  public addCategory(category: Category, catalog: Category[]): void {
    let items: BreadcrumbItem[] = [];
    items.push({
      title: category.name,
      routerLink: ['catalog', slugify(category.name || '')],
    });
    items = this.generateItems(items, category, catalog);
    this.items = [
      ...this._initItems,
      {
        title: 'Каталог',
        routerLink: ['catalog'],
      },
      ...items.reverse(),
    ];
    this._breadCrumbUpdate.next(this.items);
  }

  private generateItems(
    items: BreadcrumbItem[],
    category: Category,
    catalog: Category[],
  ): BreadcrumbItem[] {
    if (category.parentId) {
      const parent = catalog.find((item) => item.id === category.parentId);
      if (parent) {
        items.push({
          title: parent.name,
          routerLink: ['catalog', slugify(parent.name || '')],
        });
        return this.generateItems(items, parent, catalog);
      }
      return items;
    } else {
      return items;
    }
  }

  public addProduct(name: string): void {
    this._breadCrumbUpdate.next([
      ...this.items,
      {
        title: name,
        routerLink: [slugify(name || '')],
      },
    ]);
  }

  public breadCrumbChanges(): Observable<any> {
    return this._breadCrumbUpdate.asObservable();
  }
}
