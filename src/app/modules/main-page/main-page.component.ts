import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProductItem } from '../../_models/product-item';
import { AdminService } from '../../_services/back/admin.service';
import { DestroyService } from '../../_services/front/destroy.service';
import { forkJoin, takeUntil } from 'rxjs';
import { CatalogService } from '../../_services/back/catalog.service';
import { LoadingService } from '../../_services/front/loading.service';
import { Category } from '../../_models/category';
import { MainInfoService } from '../../_services/back/main-info.service';
import { Video } from '../../_models/video';
import { MainBanner } from '../../_models/main-banner';
import { DialogService } from 'primeng/dynamicdialog';
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { slugify } from 'transliteration';
import { Sale } from '../../_models/sale';
import { Media } from '../../_models/media';
import { ProductService } from '../../_services/back/product.service';
import { PopularOrder } from '../../_models/popular-order';
import { StaticDataService } from '../../_services/back/static-data.service';
import { About } from '../../_models/static-data/about';
import { Advantages } from '../../_models/static-data/advantages';
import { Animation } from '../../_models/static-data/animation';

interface MainInfo {
  main: MainBanner<unknown>;
  videos: Video[];
  media: Media[];
  comments: MainBanner<unknown>;
  clients: MainBanner<unknown>;
  popular: ProductItem[];
  sales: MainBanner<Sale[]>;
}

@Component({
  selector: 'flower-valley-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  providers: [DestroyService, DialogService],
})
export class MainPageComponent implements OnInit {
  @ViewChild('about')
  public about!: ElementRef;
  public isAdmin = false;
  public draggedItem: ProductItem | null = null;
  public draggedIndex: number | null = null;
  public isDragDropFinished: boolean = false;
  public initialArray: ProductItem[] = [];
  public aboutData: About | undefined;
  public advantagesData: Advantages | undefined;
  constructor(
    private adminService: AdminService,
    private catalogService: CatalogService,
    private productService: ProductService,
    private mainInfoService: MainInfoService,
    private staticData: StaticDataService,
    private ls: LoadingService,
    private ds: DialogService,
    private ms: MessageService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private $destroy: DestroyService,
  ) {
    adminService
      .checkAdmin()
      .pipe(takeUntil($destroy))
      .subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      });
  }

  public button = {
    title: 'Перейти в каталог',
    routerLink: ['/catalog'],
  };

  public footerButton = {
    ...this.button,
    icon: 'pi-arrow-right',
  };

  public saleSettings: MenuItem[] = [
    {
      label: 'Настройки карусели',
      icon: 'pi pi-pencil',
      command: () => this.editBannerOptions(),
    },
  ];

  public mainInfo: MainInfo | undefined;
  public catalog: Category[] = [];
  public categories: Category[] = [];
  public products: ProductItem[] = [];
  public popularProducts: ProductItem[] = [];
  public animations: Animation | undefined;

  public ngOnInit(): void {
    const reqests = [
      this.mainInfoService.getMainInfo<MainInfo>(),
      this.catalogService.getItems(),
      this.staticData.getAboutContent(),
      this.staticData.getAdvantagesContent(),
      this.staticData.getAnimations(),
    ];
    const sub = forkJoin(reqests)
      .pipe(takeUntil(this.$destroy))
      .subscribe(([main, catalog, about, advantages, animations]) => {
        // @ts-ignore
        (main as MainInfo).popular = (main as MainInfo).popular.map((product) => {
          return {
            ...product,
            count: product.coefficient || 1,
          };
        });
        (main as MainInfo).media.sort((a, b) => a.sortOrder - b.sortOrder);
        (main as MainInfo).videos.sort((a, b) => a.sortOrder - b.sortOrder);
        (main as MainInfo).clients.photos.sort((a, b) => a.sortOrder - b.sortOrder);
        (main as MainInfo).comments.photos.sort((a, b) => a.sortOrder - b.sortOrder);
        this.mainInfo = main as MainInfo;
        this.popularProducts = this.mainInfo.popular;
        this.categories = catalog as Category[];
        this.aboutData = about as About;
        this.advantagesData = advantages as Advantages;
        this.animations = animations as Animation;
        this.catalog = (catalog as Category[])
          .filter((item) => !item.parentId)
          .sort((a, b) => a.categoryOrder - b.categoryOrder);
        this.route.fragment.subscribe((fragment) => {
          setTimeout(() => {
            if (fragment) {
              const block = document.getElementById(`${fragment}Block`);
              if (block) {
                block?.scrollIntoView();
                window.scrollTo(0, block.offsetTop - 200);
              }
            }
          });
        });
        this.ls.removeSubscription(sub);
      });
    this.ls.addSubscription(sub);
  }

  public loadMainInfo(): void {
    const sub = this.mainInfoService.getMainInfo<MainInfo>().subscribe((main) => {
      this.mainInfo = main;
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public addMedia(): void {
    this.router.navigate(['admin/add/media']);
  }

  public addVideo(): void {
    this.router.navigate(['admin/add/video']);
  }

  public editFeedBack(): void {
    if (this.mainInfo) {
      sessionStorage.setItem('reviews', JSON.stringify(this.mainInfo.comments));
      this.router.navigate(['admin/edit/reviews']);
    }
  }

  public editClients(): void {
    if (this.mainInfo) {
      sessionStorage.setItem('clients', JSON.stringify(this.mainInfo.clients));
      this.router.navigate(['admin/edit/clients']);
    }
  }

  public bannerChanged(): void {
    this.loadMainInfo();
    this.ms.add({
      severity: 'success',
      summary: 'Баннер обновлен',
    });
  }

  public navigateToProduct(id: string): void {
    const product = this.mainInfo?.popular.find((item) => item.id === id);
    if (product && product.categoryName) {
      this.router.navigate(['catalog', slugify(product.categoryName), id]);
    } else {
      this.ms.add({
        severity: 'error',
        summary: 'Произошла ошибка',
        detail: 'Товар был перемещен или удален',
      });
    }
  }

  public addSale(): void {
    this.router.navigate(['admin/add/sale']);
  }

  public editBannerOptions(): void {
    if (this.mainInfo) {
      const { autoPlay, isUserCanLeaf } = this.mainInfo.sales;
      sessionStorage.setItem(
        'saleSettings',
        JSON.stringify({
          autoPlay: autoPlay,
          isUserCanLeaf: isUserCanLeaf,
        }),
      );
      this.router.navigate(['admin/edit/sale/settings']);
    }
  }

  public getCategory(categoryId: number | undefined): Category | undefined {
    return this.categories.find((category) => category.id === categoryId);
  }

  public dragStart(draggedItem: ProductItem, i: number): void {
    this.draggedIndex = i;
    this.draggedItem = draggedItem;
    this.isDragDropFinished = false;
    this.initialArray = [...this.popularProducts];
  }
  public dragEnd(): void {
    if (!this.isDragDropFinished) {
      this.popularProducts = this.initialArray as ProductItem[];
    }
    this.draggedItem = null;
  }
  public drop(): void {
    if (this.draggedItem && (this.draggedIndex || this.draggedIndex === 0)) {
      const order: PopularOrder[] = [];
      for (let i = 0; i < this.popularProducts.length; i++) {
        order.push({
          order: i,
          id: this.popularProducts[i].id || '',
        });
      }
      this.productService.setPopularOrder(order).subscribe();
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
        this.popularProducts.splice(this.draggedIndex, 1);
        this.popularProducts.splice(index, 0, this.draggedItem as ProductItem);
        this.draggedIndex = index;
      } else {
        this.popularProducts.splice(index + 1, 0, this.draggedItem as ProductItem);
        this.popularProducts.splice(this.draggedIndex, 1);
        this.draggedIndex = index;
      }
    }
  }
}
