import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AdminService } from '../back/admin.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminMenuService {
  private items: MenuItem[] = [
    {
      label: 'Панель',
      icon: 'pi pi-home',
      routerLink: '/admin',
      routerLinkActiveOptions: { exact: true },
    },
    {
      label: 'Заказы',
      routerLink: 'orders',
      state: { description: 'Управление заказами' },
      icon: 'pi pi-shopping-cart',
    },
    {
      label: 'Цены',
      routerLink: 'prices',
      state: { description: 'Редактирование прайс-листа', fullLabel: 'Прайс-лист' },
      icon: 'pi pi-file-pdf',
    },
    {
      label: 'Коробки',
      routerLink: 'boxes',
      state: {
        description: 'Просмотр, редактирование, добавление и удаление транспортировочных коробок',
      },
      icon: 'pi pi-box',
    },
    {
      label: 'Скидки',
      routerLink: 'discount',
      state: {
        description: 'Система скидок от суммы заказа в корзине',
        fullLabel: 'Скидки от суммы',
      },
      icon: 'pi pi-percentage',
    },
    {
      label: 'Статика',
      routerLink: 'static-data',
      state: {
        description:
          'Редактирование статических данных (шапка, футер, контакты, переменные и т.д.)',
        fullLabel: 'Статические данные',
      },
      icon: 'pi pi-database',
    },
    {
      label: 'Добавить',
      routerLink: 'add',
      state: { description: 'Добавление новых данных на сайт', fullLabel: 'Добавление данных' },
      icon: 'pi pi-plus',
    },
    {
      label: 'Выйти',
      icon: 'pi pi-power-off',
      command: () => this.logout(),
    },
  ];

  constructor(private adminService: AdminService, private router: Router) {}

  public logout(): void {
    this.adminService.logOut().subscribe(() => {
      this.router.navigate(['']);
    });
  }

  public getMenuItems(forTiles: boolean = false): MenuItem[] {
    if (forTiles) {
      return this.items.slice(1, this.items.length - 1);
    } else {
      return this.items;
    }
  }
}
