import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { StaticMenuService } from '../../../../_services/front/static-menu.service';

@Component({
  selector: 'flower-valley-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  public items: MenuItem[];

  constructor(private staticMenuService: StaticMenuService) {
    this.items = staticMenuService.getMenuItems(true);
  }
}
