import { Component, Input, OnInit } from '@angular/core';
import { ProductBlock } from '../../../../_models/static-data/product-block';
import { StaticDataService } from '../../../../_services/back/static-data.service';
import { LoadingService } from '../../../../_services/front/loading.service';

@Component({
  selector: 'flower-valley-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
})
export class DeliveryComponent implements OnInit {
  @Input()
  public delivery: ProductBlock | undefined;
  @Input()
  public isAdmin: boolean = false;

  constructor(private staticData: StaticDataService, private ls: LoadingService) {}

  public ngOnInit(): void {
    if (!this.isAdmin) {
      const sub = this.staticData.getProductBlockContent().subscribe((data) => {
        this.delivery = data;
        this.ls.removeSubscription(sub);
      });
      this.ls.addSubscription(sub);
    }
  }
}
