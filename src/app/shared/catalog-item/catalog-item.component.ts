import { Component, EventEmitter, Input, Output } from '@angular/core';
import { slugify } from 'transliteration';
import { Category } from '../../_models/category';
import { DialogService } from 'primeng/dynamicdialog';
import { CatalogService } from '../../_services/back/catalog.service';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'flower-valley-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss'],
  providers: [DialogService],
})
export class CatalogItemComponent {
  @Input()
  public isAdmin: boolean = false;
  private _item: any;
  @Input()
  public set item(value: Category) {
    this._item = value;
  }

  public get item(): Category {
    return this._item;
  }

  public get routerLink(): string {
    if (this.item.isTulip) {
      return 'tulips';
    }
    return slugify(this.item?.name || '');
  }

  @Output()
  private categoryDeleted: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private ds: DialogService,
    private confirmationService: ConfirmationService,
    private catalogService: CatalogService,
    private router: Router,
  ) {}

  public editCategory(): void {
    this.router.navigate(['admin/edit/category', this.item.id]);
  }

  public deleteCategory(): void {
    this.confirmationService.confirm({
      header: 'Подтвердите удаление категории',
      message: `Вы действительно хотите удалить категорию ${this.item.name}?`,
      accept: () => {
        this.catalogService.deleteItem(this.item.id).subscribe(() => {
          this.categoryDeleted.emit();
        });
      },
    });
  }
}
