import { Component, Input } from '@angular/core';

@Component({
  selector: 'flower-valley-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  @Input()
  public appearance: 'full' | 'small' = 'full';
}
