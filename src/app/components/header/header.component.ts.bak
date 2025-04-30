import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CartService } from '../../_services/front/cart.service';
import { NavigationEnd, Router } from '@angular/router';
import { ProductItem } from '../../_models/product-item';
import { filter, map } from 'rxjs';
import { OverlayPanel } from 'primeng/overlaypanel';
import { StorageService } from '../../_services/front/storage.service';
import { ProductService } from '../../_services/back/product.service';
import { PriceListGenerateService } from '../../_services/front/price-list-generate.service';
import { AddressData, Header } from '../../_models/static-data/header';
import { MainMenuUpdateService } from '../../_services/front/main-menu-update.service';
import { MainMenuService } from '../../_services/back/main-menu.service';
import { MainMenu } from '../../_models/static-data/main-menu';

@Component({
  selector: 'flower-valley-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input()
  public headerData: Header | undefined;
  @ViewChild('menuBar')
  private menuBar: TemplateRef<ElementRef> | undefined;
  @ViewChild('menuBtn')
  private menuBtn: ElementRef | undefined;
  @ViewChild('header')
  private header!: ElementRef;
  @ViewChild('cartPanel')
  private cartPanel: OverlayPanel | undefined;
  @HostListener('window:scroll')
  private scrollTop() {
    if (this.cartPanel) this.cartPanel.hide();
    if (document.documentElement.scrollTop > 150) {
      this.header.nativeElement.classList.add('scrolled');
    } else {
      this.header.nativeElement.classList.remove('scrolled');
      if (this.isMenuToggle) this.isMenuToggle = false;
    }
  }
  public searchShow: boolean = false;
  public menuShow: boolean = false;
  public isMenuToggle: boolean = false;
  public isSubMenuActive: boolean = false;
  public cart: ProductItem[] = [];
  public menu: MainMenu[] = [];

  constructor(
    private renderer: Renderer2,
    private cartService: CartService,
    private storageService: StorageService,
    private mainMenuService: MainMenuService,
    private mainMenuUpdateService: MainMenuUpdateService,
    private productService: ProductService,
    private pricesPDFService: PriceListGenerateService,
    private router: Router,
  ) {
    router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => e as NavigationEnd),
      )
      .subscribe(() => {
        this.isMenuToggle = false;
        this.menuShow = false;
        this.searchShow = false;
      });
    renderer.listen('document', 'click', (event: Event) => {
      if (
        this.isMenuToggle &&
        !this.menuBar?.elementRef.nativeElement.contains(event.target) &&
        !this.menuBtn?.nativeElement.contains(event.target)
      ) {
        this.isMenuToggle = false;
      }
    });
    mainMenuUpdateService.updated().subscribe((items) => {
      if (items) {
        this.menu = items;

		console.log(items);
      } else {
        mainMenuService.getMenuItems().subscribe((menu) => {

          this.menu = menu;
		  console.log(menu);
		  this.menu.push({ id: 100, title: 'Новый филиал', link: '/branch' });
        });
      }
    });
  }

  ngOnInit(): void {
    this.cartService.cartUpdate().subscribe((cart) => {
      this.cart = cart;
    });
  }

  public get getSum(): number {
    let sum = 0;
    this.cart?.map((cart) => (sum += cart.price * cart.count));
    return sum;
  }

  public get getCount(): number {
    return this.cart?.length || 0;
  }

  public goToCart(): void {
    this.router.navigate(['cart']);
  }

  public searchToggle(): void {
    this.menuShow = false;
    this.searchShow = !this.searchShow;
  }

  public menuToggle(): void {
    this.searchShow = false;
    this.menuShow = !this.menuShow;
  }

  public getLink(url: string): string {
	 // console.log( url.split('#')[0]);
    return url.split('#')[0].replace("/catalog", "");
  }

  public getFragment(url: string): string {
    return url.split('#')[1];
  }

  public getPriceList(): void {
    this.pricesPDFService.generatePriceList();
  }

  public getAddressData(): AddressData[] | [] {
    const data: AddressData[] = [];
    if (this.headerData) {
      this.headerData.address.map((item, index) => {
        data.push({
			lonlan: "n/a",
				  addrname: "n/a",
          address: item,
          workTime:
            this.headerData && this.headerData.workTime[index]
              ? this.headerData.workTime[index]
              : '',
        });
      });
    }
    return data;
  }
}
