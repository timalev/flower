import { Component, Input } from '@angular/core';
import { responsiveOptions } from '../../../_utils/constants';
import { MainBanner } from '../../../_models/main-banner';

@Component({
  selector: 'flower-valley-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent {
  public responsiveOptions = responsiveOptions;
  @Input()
  public isAdmin: boolean = false;
  @Input()
  public reviewCarousel!: MainBanner<unknown>;

  public displayCustom: boolean = false;

  public activeIndex: number = 0;

  public openImage(id: number): void {
    this.activeIndex = this.reviewCarousel?.photos.findIndex((item) => item.id === id);
    this.displayCustom = true;
  }
}
