import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AdminMenuService } from '../../_services/front/admin-menu.service';

@Component({
  selector: 'flower-valley-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  public items: MenuItem[] = [];
  constructor(private adminMenuService: AdminMenuService) {
    this.items = adminMenuService.getMenuItems();
  }
}
