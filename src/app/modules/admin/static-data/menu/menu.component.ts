import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { StaticMenuService } from '../../../../_services/front/static-menu.service';

@Component({
  selector: 'flower-valley-static-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  public items: MenuItem[] = [];
  constructor(private staticMenuService: StaticMenuService) {
    this.items = staticMenuService.getMenuItems();
  }
}
