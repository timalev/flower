import { Component, OnInit } from '@angular/core';
import { MainMenu, MainMenuItem } from '../../../../../_models/static-data/main-menu';
import { CatalogService } from '../../../../../_services/back/catalog.service';
import { mainMenuStatic } from '../../../../../_utils/constants';
import { slugify } from 'transliteration';
import { Category } from '../../../../../_models/category';
import { MainMenuService } from '../../../../../_services/back/main-menu.service';
import { MainMenuUpdateService } from '../../../../../_services/front/main-menu-update.service';

@Component({
  selector: 'flower-valley-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {
  public menu: MainMenu[] = [];
  public staticMenu = mainMenuStatic;
  public isLoading: boolean = false;
  public isSaving: boolean = false;
  public filteredItems: MainMenuItem[] = [];
  private clonedItems: { [s: string]: MainMenu } = {};

  constructor(
    private catalogService: CatalogService,
    private menuService: MainMenuService,
    private menuUpdateService: MainMenuUpdateService,
  ) {}

  ngOnInit(): void {
    this.catalogService.getItems().subscribe((items) => {
      this.staticMenu = this.staticMenu.concat(
        items.map((item) => {
          return {
            title: item.name,
            link: this.getCategoryLink(item),
          };
        }),
      );
    });
    this.isLoading = true;
    this.menuService.getMenuItems().subscribe((items) => {
      this.menu = items;
      this.isLoading = false;
    });
  }

  public getCategoryLink(category: Category): string {
    if (category.isTulip) {
      return '/catalog/tulips';
    }
    return `/catalog/${slugify(category.name)}`;
  }

  public getLink(url: string): string {
    return url.split('#')[0];
  }

  public getFragment(url: string): string {
    return url.split('#')[1];
  }

  public onRowEditInit(menuItem: MainMenu): void {
    this.clonedItems[menuItem.id] = { ...menuItem };
  }

  public onRowEditSave(menuItem: MainMenu) {
    delete this.clonedItems[menuItem.id];
  }

  public onRowEditCancel(menuItem: MainMenu, index: number) {
    this.menu[index] = this.clonedItems[menuItem.id];
    delete this.clonedItems[menuItem.id];
  }

  public saveMenu(): void {
    this.isSaving = true;
    this.isLoading = true;
    const menu: MainMenuItem[] = this.menu.map((item) => {
      return {
        title: item.title,
        link: item.link,
      };
    });
    this.menuService.saveMenuItems(menu).subscribe((items) => {
      this.menu = items;
      this.menuUpdateService.update(this.menu);
      this.isLoading = false;
      this.isSaving = false;
    });
  }

  public menuItemSelected(selectedItem: MainMenuItem, currentItem: MainMenu): void {
    currentItem.title = selectedItem.title;
    currentItem.link = selectedItem.link;
  }

  public searchItem(searchString: string): void {
    this.filteredItems = this.staticMenu.filter((item) => item.title.includes(searchString));
  }
}
