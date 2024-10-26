import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'flower-valley-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent {
  public items: MenuItem[] = [
    {
      label: 'Категория',
      routerLink: 'category',
      icon: 'pi pi-folder-open',
    },
    {
      label: 'Товар',
      routerLink: 'product',
      queryParams: { isImport: false },
      icon: 'pi pi-book',
    },
    {
      label: 'Импорт товара',
      routerLink: 'product',
      queryParams: { isImport: true },
      icon: 'pi pi-download',
    },
    {
      label: 'Коробка',
      routerLink: 'box',
      icon: 'pi pi-box',
    },
    {
      label: 'Акция',
      routerLink: 'sale',
      icon: 'pi pi-clock',
    },
    {
      label: 'Видео',
      routerLink: 'video',
      icon: 'pi pi-youtube',
    },
    {
      label: 'Статья',
      routerLink: 'media',
      icon: 'pi pi-external-link',
    },
    {
      label: 'Скидка на заказ',
      routerLink: 'discount',
      icon: 'pi pi-percentage',
    },
  ];
}
