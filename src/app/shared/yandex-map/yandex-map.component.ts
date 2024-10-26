import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { YaMapService } from '../../_services/front/ya-map.service';

@Component({
  selector: 'flower-valley-yandex-map',
  templateUrl: './yandex-map.component.html',
})
export class YandexMapComponent {
  @ViewChild('mapContent') public mapContent: ElementRef<HTMLElement> | undefined;
  @ViewChild('yamap') public map: ElementRef<HTMLElement> | undefined;
  @Input()
  private isMapAlreadyGenerated: boolean = false;
  public showMap = false;

  public get innerWidth(): number {
    return window.innerWidth;
  }

  constructor(private yaMap: YaMapService, private cdr: ChangeDetectorRef) {}

  public showMapToggle(): void {
    this.showMap = true;
    if (!this.isMapAlreadyGenerated) {
      const yaMap = this.map;
      if (yaMap) {
        yaMap.nativeElement.style.width = this.innerWidth > 600 ? '600px' : '100%';
        yaMap.nativeElement.style.height = '600px';
        yaMap.nativeElement.style.position = 'static';
        if (this.mapContent) {
          this.mapContent.nativeElement.append(yaMap.nativeElement);
          this.mapRedraw();
          this.isMapAlreadyGenerated = true;
        }
      }
    }
    this.cdr.detectChanges();
  }

  public mapRedraw(): void {
    this.yaMap.yaMapRedraw();
    this.cdr.detectChanges();
  }

  public visibleChange(): void {
    this.cdr.detectChanges();
  }
}
