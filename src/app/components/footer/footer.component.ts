import { Component, Input } from '@angular/core';
import { AddressData, Footer } from '../../_models/static-data/header';
import { PriceListGenerateService } from '../../_services/front/price-list-generate.service';

import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'flower-valley-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input()
  public footer: Footer | undefined;

  constructor(private pricesPDFService: PriceListGenerateService, private sanitizer:DomSanitizer) {}

  public getPriceList(): void {
    this.pricesPDFService.generatePriceList();
  }
  
  
  public sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
}

  public getAddressData(): AddressData[] | [] {
    const data: AddressData[] = [];
    if (this.footer) {
      this.footer.address.map((item, index) => {
        data.push({                                               
lonlan: [{ id: 0, lat: '55.594982', lon: '37.987759' },{ id: 1, lat: '55.704222', lon: '36.847373' }],
	  addrname: [{name: 'Агрофирма Цветочная Долина ОСТРОВЦЫ'},{name: 'Агрофирма Цветочная Долина ЗВЕНИГОРОД'}],


          address: item,
          workTime: this.footer && this.footer.workTime[index] ? this.footer.workTime[index] : '',
		
        });
      });
    }
    return data;
  }
}
