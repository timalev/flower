import { Injectable } from '@angular/core';

export interface SortOrder {
  id: number;
  sortOrder: number;
}

@Injectable({
  providedIn: 'root',
})
export class SortOrderService<T extends { id: number }> {
  private draggedItem: T | null = null;
  private draggedIndex: number | null = null;
  private isDragDropFinished: boolean = false;
  private initialArray: T[] = [];

  public dragStart(array: T[], draggedItem: T, i: number): void {
    this.draggedIndex = i;
    this.draggedItem = draggedItem;
    this.isDragDropFinished = false;
    this.initialArray = [...array];
  }
  public dragEnd(array: T[]): T[] {
    if (!this.isDragDropFinished) {
      array = this.initialArray as T[];
    }
    this.draggedItem = null;
    return array;
  }
  public drop(array: T[]): any {
    if (this.draggedItem && (this.draggedIndex || this.draggedIndex === 0)) {
      const order: SortOrder[] = [];
      for (let i = 0; i < array.length; i++) {
        order.push({
          sortOrder: i,
          id: array[i].id,
        });
      }
      this.draggedItem = null;
      this.draggedIndex = null;
      this.isDragDropFinished = true;
      return order;
    }
  }
  public setPosition(array: T[], index: number): T[] {
    if (
      this.draggedItem &&
      (this.draggedIndex || this.draggedIndex === 0) &&
      this.draggedIndex !== index
    ) {
      if (index < this.draggedIndex) {
        array.splice(this.draggedIndex, 1);
        array.splice(index, 0, this.draggedItem as T);
        this.draggedIndex = index;
      } else {
        array.splice(index + 1, 0, this.draggedItem as T);
        array.splice(this.draggedIndex, 1);
        this.draggedIndex = index;
      }
    }
    return array;
  }
}
