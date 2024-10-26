import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { BreadcrumbService } from './components/breadcrumb/breadcrumb.service';
import { DialogService } from 'primeng/dynamicdialog';
import { LoadingService } from './_services/front/loading.service';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, forkJoin, map, mergeMap } from 'rxjs';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { StaticDataService } from './_services/back/static-data.service';
import { Footer, Header } from './_models/static-data/header';
import { MobileButtons } from './_models/static-data/variables';
import { SEOService } from './_services/front/seo.service';

@Component({
  selector: 'flower-valley-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DialogService],
})
export class AppComponent implements OnInit {
  public cookieVisible = false;
  public header: Header | undefined;
  public footer: Footer | undefined;
  public mobileButtons: MobileButtons | undefined;
  private activatedRoute: ActivatedRoute;
  public background: 'light' | 'dark' = 'light';
  @HostListener('document:keydown.control.m')
  private openAdminPanel() {
    this.router.navigate(['admin']);
  }
  constructor(
    private _bs: BreadcrumbService,
    private _ds: DialogService,
    private ms: MessageService,
    private staticData: StaticDataService,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private config: PrimeNGConfig,
    private _seoService: SEOService,
  ) {
    this.activatedRoute = route;
    loadingService.changeDetectorRef = cdr;
    _bs.backgroundChanges.subscribe((background) => {
      this.background = background;
      cdr.detectChanges();
    });
    router.events
      .pipe(
        filter((e) => e instanceof NavigationStart),
        map((e) => e as NavigationStart),
      )
      .subscribe(() => {
        loadingService.cancelLoading();
      });
    this.setConfig();
  }

  public ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data),
      )
      .subscribe((event) => {
        if (event['title']) {
          if (event['main']) {
            this._seoService.updateTitle(event['title'], true);
          } else {
            this._seoService.updateTitle(event['title']);
          }
        }
        if (event['keywords']) this._seoService.updateKeywords(event['keywords']);
        if (event['description']) this._seoService.updateDescription(event['description']);
      });
    this.router.events.subscribe((event) => {
      this.loadingService.setLoading(event);
    });
    if (this.isMobile) {
      this.staticData.getMobileVariables().subscribe((data) => {
        this.mobileButtons = data;
      });
    }
    const requests = [
      this.staticData.getHeaderContent(),
      this.staticData.getFooterContent(),
      this.staticData.getMobileVariables(),
    ];
    forkJoin(requests).subscribe(([header, footer, buttons]) => {
      this.header = header as Header;
      this.footer = footer as Footer;
      this.mobileButtons = buttons as MobileButtons;
    });
  }

  public get isShowBreadcrumb(): boolean {
    return this._bs.isShow;
  }

  private setConfig(): void {
    this.config.setTranslation({
      dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      monthNames: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
      ],
      monthNamesShort: [
        'Янв',
        'Фев',
        'Март',
        'Апр',
        'Май',
        'Июнь',
        'Июль',
        'Авг',
        'Сен',
        'Окт',
        'Ноя',
        'Дек',
      ],
      today: 'Сегодня',
      clear: 'Очистить',
    });
  }

  public get isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
      navigator.userAgent,
    );
  }
}
