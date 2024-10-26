import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../_models/category';
import { BreadcrumbService } from '../../../components/breadcrumb/breadcrumb.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
import { slugify } from 'transliteration';
import { CatalogService } from '../../../_services/back/catalog.service';
import { StorageService } from '../../../_services/front/storage.service';
import { categoriesKey } from '../../../_utils/constants';
import { AdminService } from '../../../_services/back/admin.service';
import { ProductItem } from '../../../_models/product-item';
import { LoadingService } from '../../../_services/front/loading.service';
import { ProductService } from '../../../_services/back/product.service';
import { ProductOrder } from '../../../_models/product-order';
import { CategoryOrder } from '../../../_models/category-order';
import { SEOService } from '../../../_services/front/seo.service';

@Component({
  selector: 'flower-valley-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [DialogService],
})
export class CategoryComponent implements OnInit {
  public isAdmin: boolean = false;
  public category: Category | undefined;
  public catalog: Category[] = [];
  public products: ProductItem[] = [];
  public actions: MenuItem[] = [
    {
      label: 'Новый товар',
      icon: 'pi pi-plus',
      command: () => this.addProduct(),
    },
    {
      label: 'Импорт из БизнесПак',
      icon: 'pi pi-upload',
      command: () => this.addProduct(true),
    },
    {
      label: 'Добавить группу товаров',
      icon: 'pi pi-folder',
      command: () => this.addCategory(),
    },
  ];
  public subCatalog: Category[] = [];
  public draggedItem: Category | ProductItem | null = null;
  public draggedIndex: number | null = null;
  public isDragDropFinished: boolean = false;
  public initialArray: Category[] | ProductItem[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bs: BreadcrumbService,
    private ds: DialogService,
    private adminService: AdminService,
    private storageService: StorageService,
    private catalogService: CatalogService,
    private productService: ProductService,
    private seoService: SEOService,
    private ls: LoadingService,
  ) {
    adminService.checkAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
		console.log(params);
      const categoryRoute = params['category'];
      this.catalog = this.storageService.getItem<Category[]>(categoriesKey) || [];
      if (this.catalog.length) {
        this.setCategories(categoryRoute);
      } else {
        const sub = this.catalogService.getItems().subscribe((categoriesApi) => {
          this.catalog = categoriesApi;
          this.storageService.setItem(categoriesKey, categoriesApi);
          this.setCategories(categoryRoute);
          this.ls.removeSubscription(sub);
        });
        this.ls.addSubscription(sub);
      }
    });
  }

  public navigateTo(id: number): void {
    this.router.navigate([id], { relativeTo: this.route });
  }

  public addProduct(isImport: boolean = false): void {
    this.router.navigate(['admin/add/product'], {
      queryParams: {
        isImport: isImport,
        category: this.category?.id,
      },
    });
  }

  public addCategory(): void {
    this.router.navigate(['admin/add/category'], {
      queryParams: {
        categoryId: this.category?.id,
      },
    });
  }

  public editCategory(): void {
    this.router.navigate(['admin/edit/category', this.category?.id]);
  }

  private setCategories(categoryRoute: string): void {
    switch (categoryRoute) {
      case 'tulips':
        this.category = this.catalog.find((item) => item.id === 1);
        break;
      default:
        this.category = this.catalog.find((item) => slugify(item.name) === categoryRoute);
        break;
    }
    this.subCatalog = this.catalog
      .filter((item) => item.parentId === this.category?.id)
      .sort((a, b) => a.categoryOrder - b.categoryOrder);
    this.getProductsList();
  }

  private getProductsList(): void {
    if (this.category) {
      this.bs.addCategory(this.category, this.catalog);
      this.seoService.updateTitle(this.category.name);
      this.seoService.updateKeywords(this.category.name.split(' ').join(','));
      this.seoService.updateDescription('Товары категории - ' + this.category.name);
      const sub = this.catalogService
        .getItemById<Category>(this.category.id)
        .subscribe((category) => {
          this.products =
            category.products?.map((product) => {
              return {
                ...product,
                count: Number(product.coefficient) || 1,
                initialPrice: product.price,
              };
            }) || [];
          this.ls.removeSubscription(sub);
        });
      this.ls.addSubscription(sub);
    }
  }

  public deleteProduct(id?: string) {
    const index = this.products.findIndex((product) => product.id === id);
    this.products.splice(index, 1);
  }

  public deleteCategory(id: number): void {
    const index = this.subCatalog.findIndex((category) => category.id === id);
    this.subCatalog.splice(index, 1);
    this.storageService.removeItem<Category>(categoriesKey, id);
  }

  public dragStart(draggedItem: Category | ProductItem, i: number): void {
    this.draggedIndex = i;
    this.draggedItem = draggedItem;
    this.isDragDropFinished = false;
    if (CategoryComponent.instanceOfProduct(this.draggedItem)) {
      this.initialArray = [...this.products];
    } else {
      this.initialArray = [...this.subCatalog];
    }
  }
  public dragEnd(): void {
    if (!this.isDragDropFinished) {
      if (CategoryComponent.instanceOfProduct(this.draggedItem)) {
        this.products = this.initialArray as ProductItem[];
      } else {
        this.subCatalog = this.initialArray as Category[];
      }
    }
    this.draggedItem = null;
  }
  public drop(): void {
    if (this.draggedItem && (this.draggedIndex || this.draggedIndex === 0)) {
      if (CategoryComponent.instanceOfProduct(this.draggedItem)) {
        const order: ProductOrder[] = [];
        for (let i = 0; i < this.products.length; i++) {
          order.push({
            productOrder: i,
            productCategoryId: this.products[i].productCategoryId,
          });
        }
        this.productService.setProductsOrder(order).subscribe();
      } else {
        const order: CategoryOrder[] = [];
        for (let i = 0; i < this.subCatalog.length; i++) {
          order.push({
            id: this.subCatalog[i].id,
            categoryOrder: i,
          });
        }
        this.catalogService.setCategoryOrder(order).subscribe(() => {
          this.catalogService.getItems().subscribe((categories) => {
            this.storageService.setItem(categoriesKey, categories);
          });
        });
      }
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
        if (CategoryComponent.instanceOfProduct(this.draggedItem)) {
          this.products.splice(this.draggedIndex, 1);
          this.products.splice(index, 0, this.draggedItem as ProductItem);
        } else {
          this.subCatalog.splice(this.draggedIndex, 1);
          this.subCatalog.splice(index, 0, this.draggedItem as Category);
        }
        this.draggedIndex = index;
      } else {
        if (CategoryComponent.instanceOfProduct(this.draggedItem)) {
          this.products.splice(index + 1, 0, this.draggedItem as ProductItem);
          this.products.splice(this.draggedIndex, 1);
        } else {
          this.subCatalog.splice(index + 1, 0, this.draggedItem as Category);
          this.subCatalog.splice(this.draggedIndex, 1);
        }
        this.draggedIndex = index;
      }
    }
  }

  private static instanceOfProduct(item: any): boolean {
    return 'description' in item;
  }
}
