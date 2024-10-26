import { Component, OnInit } from '@angular/core';
import { Box } from '../../../_models/box';
import { BoxService } from '../../../_services/back/box.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'flower-valley-boxes',
  templateUrl: './boxes.component.html',
  styleUrls: ['./boxes.component.scss'],
})
export class BoxesComponent implements OnInit {
  public boxes: Box[] = [];
  private clonedBoxes: { [s: string]: Box } = {};
  public isLoading: boolean = false;

  constructor(private boxService: BoxService, private ms: MessageService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.boxService.getItems().subscribe((boxes) => {
      this.boxes = boxes;
      this.isLoading = false;
    });
  }

  public deleteItem(id: number): void {
    this.isLoading = true;
    this.boxService.deleteItem(id).subscribe(
      () => {
        const index = this.boxes.findIndex((box) => box.id === id);
        this.boxes.splice(index, 1);
        this.isLoading = false;
      },
      ({ error }) => {
        this.ms.add({
          severity: 'error',
          summary: error.message,
          detail: 'Возможно, данная коробка используется для упаковки товара',
        });
        this.isLoading = false;
      },
    );
  }

  public navigateToAddBox(): void {
    this.router.navigate(['admin/add/box']);
  }

  public onRowEditInit(box: Box): void {
    this.clonedBoxes[box.id] = { ...box };
  }

  public onRowEditSave(box: Box) {
    this.isLoading = true;
    this.boxService.updateItem(box).subscribe(() => {
      delete this.clonedBoxes[box.id];
      this.isLoading = false;
    });
  }

  public onRowEditCancel(box: Box, index: number) {
    this.boxes[index] = this.clonedBoxes[box.id];
    delete this.clonedBoxes[box.id];
  }
}
