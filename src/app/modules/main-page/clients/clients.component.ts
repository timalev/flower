import { Component, Input } from '@angular/core';
import { responsiveOptions } from '../../../_utils/constants';
import { MainBanner } from '../../../_models/main-banner';

@Component({
  selector: 'flower-valley-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent {
  public responsiveOptions = responsiveOptions;
  @Input()
  public isAdmin: boolean = false;
  @Input()
  public clientsCarousel!: MainBanner<unknown>;
  public displayCustom: boolean = false;

  public activeIndex: number = 0;

  public openImage(id: number): void {
    this.activeIndex = this.clientsCarousel.photos.findIndex((item) => item.id === id);
    this.displayCustom = true;
  }
}
