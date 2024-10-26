import { Component, Input } from '@angular/core';

@Component({
  selector: 'flower-valley-leaf-button',
  templateUrl: './leaf-button.component.html',
  styleUrls: ['./leaf-button.component.scss'],
})
export class LeafButtonComponent {
  @Input()
  public title: string | undefined;
  @Input()
  public styleClass: string = '';
}
