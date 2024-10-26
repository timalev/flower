import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../components/breadcrumb/breadcrumb.service';
import { DialogService } from 'primeng/dynamicdialog';
import { CatalogService } from '../../_services/back/catalog.service';
import { Category } from '../../_models/category';
import { StorageService } from '../../_services/front/storage.service';
import { categoriesKey } from '../../_utils/constants';
import { AdminService } from '../../_services/back/admin.service';
import { LoadingService } from '../../_services/front/loading.service';
import { CategoryOrder } from '../../_models/category-order';
import { Router } from '@angular/router';
import { SEOService } from '../../_services/front/seo.service';

@Component({
  selector: 'flower-valley-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  providers: [DialogService],
})
export class CatalogComponent implements OnInit {
  public catalog: Category[] = [];
  public isAdmin: boolean = false;
  public draggedItem: Category | null = null;
  public draggedIndex: number | null = null;
  public isDragDropFinished: boolean = false;
  public initialCatalog: Category[] = [];
  constructor(
    private bs: BreadcrumbService,
    private catalogService: CatalogService,
    private storageService: StorageService,
    private adminService: AdminService,
    private router: Router,
    private seoService: SEOService,
    private ls: LoadingService,
  ) {
    bs.setItem('Каталог');
    adminService.checkAdmin().subscribe((isAdmin) => (this.isAdmin = isAdmin));
  }

  public ngOnInit(): void {
    this.getCategories();
  }

  private getCategories(): void {

	  //console.log("categ");
    const sub = this.catalogService.getItems().subscribe((categories) => {
      let keywords: string[] = [];
      this.catalog = categories
        .filter((item) => !item.parentId)
        .sort((a, b) => a.categoryOrder - b.categoryOrder)
        .map((category) => {
          keywords = keywords.concat(category.name.toLowerCase().split(' ').join(','));
		//  console.log(category);
          return category;
        });
      this.seoService.updateKeywords(keywords.join(','));
      this.storageService.setItem(categoriesKey, categories);
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public addCategory(): void {
    this.router.navigateByUrl('admin/add/category');
  }

  public deleteCategory(id: number): void {
    const index = this.catalog.findIndex((category) => category.id === id);
    this.catalog.splice(index, 1);
  }

  public dragStart(category: Category, i: number): void {
    this.draggedIndex = i;
    this.draggedItem = category;
    this.isDragDropFinished = false;
    this.initialCatalog = [...this.catalog];
  }
  public dragEnd(): void {
    if (!this.isDragDropFinished) {
      this.catalog = this.initialCatalog;
    }
    this.draggedItem = null;
  }
  public drop(): void {
    if (this.draggedItem && (this.draggedIndex || this.draggedIndex === 0)) {
      const order: CategoryOrder[] = [];
      for (let i = 0; i < this.catalog.length; i++) {
        order.push({
          id: this.catalog[i].id,
          categoryOrder: i,
        });
      }
      this.catalogService.setCategoryOrder(order).subscribe(() => {
        this.catalogService.getItems().subscribe((categories) => {
          this.storageService.setItem(categoriesKey, categories);
        });
      });
      this.draggedItem = null;
      this.draggedIndex = null;
      this.isDragDropFinished = true;
    }
  }
  public setPosition(index: number): void {
    if (
      this.draggedItem &&
      (this.draggedIndex || this.draggedIndex === 0) &&
      this.draggedIndex !== index
    ) {
      if (index < this.draggedIndex) {
        this.catalog.splice(this.draggedIndex, 1);
        this.catalog.splice(index, 0, this.draggedItem);
        this.draggedIndex = index;
      } else {
        this.catalog.splice(index + 1, 0, this.draggedItem);
        this.catalog.splice(this.draggedIndex, 1);
        this.draggedIndex = index;
      }
    }
  }
}
