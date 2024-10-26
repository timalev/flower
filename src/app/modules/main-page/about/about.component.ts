import { Component, Input } from '@angular/core';
import { About } from '../../../_models/static-data/about';

@Component({
  selector: 'flower-valley-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  @Input()
  public aboutData: About | undefined;
}
