import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Category } from '../../../../_models/category';
import { CategoryMenu } from '../../../../_models/category-menu';
import { slugify } from 'transliteration';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../../../_services/front/storage.service';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { LoadingService } from '../../../../_services/front/loading.service';

@Component({
  selector: 'flower-valley-category-menu',
  templateUrl: './category-menu.component.html',
  styleUrls: ['./category-menu.component.scss'],
})
export class CategoryMenuComponent implements OnInit {
  @ViewChild('menuItem')
  private menuItem: ElementRef | undefined;
  @Input()
  public category: Category | undefined;
  private catalog: Category[] = [];
  public menu: CategoryMenu[] = [];
  public showSubMenu: boolean = false;
  public currentIndex: number | undefined;
  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private catalogService: CatalogService,
    private ls: LoadingService,
    private cdr: ChangeDetectorRef,
  ) {
    renderer.listen('document', 'click', (event: Event) => {
      if (this.showSubMenu && !this.menuItem?.nativeElement.contains(event.target)) {
        this.showSubMenu = false;
      }
    });
  }

  public ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.showSubMenu = false;
      this.storageService.storageUpdated<Category[]>().subscribe((catalog) => {
        this.catalog = catalog;
        if (this.catalog?.length) {
          this.menu = this.generateMenuModel(this.catalog);
        } else {
          const sub = this.catalogService.getItems().subscribe((categoriesApi) => {
            this.catalog = categoriesApi;
            this.menu = this.generateMenuModel(this.catalog);
            this.ls.removeSubscription(sub);
          });
          this.ls.addSubscription(sub);
        }
      });
    });
  }

  public isActive(name: string, items?: CategoryMenu[]): boolean {
    if (items?.length) {
      if (!!items.find((item) => item.name === this.category?.name)) return true;
    }
    return this.category?.name === name;
  }

  private generateMenuModel(catalog: Category[]): CategoryMenu[] {
    this.menu = [];
    const mapped = catalog
      .filter((item) => !item.parentId)
      .sort((a, b) => a.categoryOrder - b.categoryOrder);
    mapped.map((item) => {
      this.menu.push({
        id: item.id,
        name: item.name,
        isTulip: item.isTulip,
        routerLink: [CategoryMenuComponent.getRoute(item)],
        relativeTo: this.route.parent,
      });
    });
    this.menu.map((menuItem) => {
      const child = catalog
        .filter((item) => item.parentId === Number(menuItem.id))
        .sort((a, b) => a.categoryOrder - b.categoryOrder);
      child.map((item) => {
        if (!menuItem.items) menuItem.items = [];
        menuItem.items.push({
          id: item.id,
          name: item.name,
          isTulip: item.isTulip,
          routerLink: [CategoryMenuComponent.getRoute(item)],
          relativeTo: this.route.parent,
        });
      });
    });
    return this.menu;
  }

  private static getRoute(item: CategoryMenu | Category): string {


    if (item.isTulip) {
      return '/tulips';
    }
	//console.log(item.name);
    return '/' + slugify(item.name);
  }

  public menuToggle(i: number, items = 0): void {
    this.showSubMenu = !!items;
    this.currentIndex = i;
    this.cdr.detectChanges();
  }
}
