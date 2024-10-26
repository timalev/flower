import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AdminMenuService } from '../../../_services/front/admin-menu.service';

@Component({
  selector: 'flower-valley-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent {
  public items: MenuItem[];

  constructor(private adminMenuService: AdminMenuService) {
    this.items = adminMenuService.getMenuItems(true);
  }
}
