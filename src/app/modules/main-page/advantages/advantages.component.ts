import { Component, Input } from '@angular/core';
import { Advantages } from '../../../_models/static-data/advantages';

@Component({
  selector: 'flower-valley-advantages',
  templateUrl: './advantages.component.html',
  styleUrls: ['./advantages.component.scss'],
})
export class AdvantagesComponent {
  @Input()
  public advantagesData: Advantages | undefined;
}
