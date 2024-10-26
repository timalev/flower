import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { moscowPolygon } from '../../_utils/ya_map_data';
import { StaticDataService } from '../back/static-data.service';
import { CartVariables } from '../../_models/static-data/variables';

declare var ymaps: any;

@Injectable()
export class YaMapService {
  private flowerValleyMap: any;
  private searchBounds: any;
  private polygon: any;
  private route: any;
  private point: any;
  private isFinished: boolean = false;
  private vars: CartVariables | undefined;

  private calculationUpdate: Subject<number | undefined> = new Subject<number | undefined>();
  public addressChanged: Subject<string> = new Subject<string>();

  constructor(private _element: ElementRef<HTMLElement>, private staticData: StaticDataService) {
    staticData.getCartVariables().subscribe((vars) => {
      this.vars = vars;
      ymaps.ready(() => {
        this.setMapConfig();
      });
    });
    this.addressChanged.subscribe((address) => {
      this.requestToYandexGeocoder(address);
    });
  }

  public calculateShippingCost(): Observable<number | undefined> {
    return this.calculationUpdate.asObservable();
  }

  private requestToYandexGeocoder(address: string): void {
    this.isFinished = false;
    if (this.route) {
      this.flowerValleyMap.geoObjects.remove(this.route);
      this.route = undefined;
    }
    if (this.point) {
      this.flowerValleyMap.geoObjects.remove(this.point);
      this.point = undefined;
    }
    const geocoder = new ymaps.geocode(address, {
      boundedBy: this.searchBounds,
      strictBounds: true,
    });
    geocoder.then((res: any) => {
      if (res.geoObjects.getLength()) {
        const point = res.geoObjects.get(0);
        if (this.polygon.geometry.contains(point.geometry.getCoordinates())) {
          this.point = point;
          this.flowerValleyMap.geoObjects.add(point);
          const basePrice = Number(this.polygon.properties.get('description'));
          this.calculationUpdate.next(basePrice);
          this.isFinished = true;
        } else {
          this.calculationUpdate.next(undefined);
        }
        // if (!this.isFinished) {
        //   const routes: any[] = [];
        //   const from = this.polygon.geometry.getClosest(point.geometry.getCoordinates());
        //   const router = new ymaps.route([
        //     this.polygon.geometry.getCoordinates()[0][from.closestPointIndex],
        //     address,
        //   ]);
        //   router.then((route: any) => {
        //     routes.push(route);
        //     if (routes.length === 1) {
        //       this.flowerValleyMap.geoObjects.add(route);
        //       this.route = route;
        //       const shippingCost = Math.ceil(route.getLength() / 1000);
        //       const basePrice = Number(this.polygon.properties.get('description'));
        //       if (this.vars) {
        //         this.calculationUpdate.next(shippingCost * this.vars.deliveryPerKm + basePrice);
        //       }
        //     }
        //   });
        // }
      } else {
        this.calculationUpdate.next(0);
      }
    });
  }

  private setMapConfig(): void {
    this.flowerValleyMap = new ymaps.Map('yaMap', {
      center: [37.622093, 55.753994],
      zoom: 9,
    });
    this.searchBounds = [
      [36.725552, 56.334356],
      [38.604214, 55.296747],
    ];
    this.setPolygon();
  }

  public yaMapRedraw(): void {
    this.flowerValleyMap.container.fitToViewport();
  }

  // private static minRoute(array: any[]): any {
  //   let minRoute = array[0];
  //   let returnedIndex = 0;
  //   let min = minRoute.getLength();
  //   for (let i = 1; i < array.length; i++) {
  //     const current = array[i].getLength();
  //     if (current < min) {
  //       minRoute = array[i];
  //       returnedIndex = i;
  //     }
  //   }
  //   return [minRoute, returnedIndex];
  // }

  private setPolygon(): void {
    if (this.vars) {
      let content = ` рублей + ${this.vars.deliveryPerKm}р./км за зоной`;
      let description: string;
      const localMoscowPolygon = moscowPolygon;
      description = this.vars.moscowDelivery.toString();
      localMoscowPolygon.properties.description = description;
      localMoscowPolygon.properties.balloonContent = description + content;
      this.polygon = new ymaps.GeoObject(localMoscowPolygon, { ...localMoscowPolygon.options });
      this.flowerValleyMap.geoObjects.add(this.polygon);
    }
  }
}
