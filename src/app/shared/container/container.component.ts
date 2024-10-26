import { Component, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { BreadcrumbService } from '../../components/breadcrumb/breadcrumb.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs';
import { DestroyService } from '../../_services/front/destroy.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'flower-valley-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DestroyService],
})
export class ContainerComponent implements OnInit {
  @Input()
  // @ts-ignore
  public headerTemplate: TemplateRef<any>;
  @Input()
  public headerTitle: string | undefined;
  @Input()
  public headerIcon: string | undefined;
  @Input()
  public headerIconImage: string | undefined;
  @Input()
  public background: 'light' | 'dark' = 'light';
  @Input()
  public headerButton: Record<string, any> | undefined;
  @Input()
  public footerButton: Record<string, any> | undefined;
  @Input()
  public seocont: string | undefined;
   @Input()
  public isAdmin: boolean = false;

      @Input()
  public isTscont: boolean = false;

  @Input()
  // @ts-ignore
  public buttonTemplate: TemplateRef<any>;

  private url!: string;

   public h1: any; 

  constructor(
	
  private http: HttpClient,
    private bs: BreadcrumbService,
    private router: Router,
    private destroy$: DestroyService,

  ) {
	   this.h1 = "";

    router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((e) => e instanceof NavigationEnd),
        map((e) => e as NavigationEnd),
      )
      .subscribe((event) => {
        this.url = event.urlAfterRedirects;
      });


	    this.http.get<any>('https://flowervalley.ru/back/seo_api.php?h1=' + window.location.pathname).subscribe(data => {
		
		if (data.h1!="")
		{
			console.log(data.h1);
			this.headerTitle =data.h1;

			 
		}
	   });

     if (window.location.pathname == "/tulips" || window.location.pathname == "/seedlings")
     {
		// this.seocont = window.location.pathname;

		 this.http.get<any>('https://flowervalley.ru/back/seo_api.php?tscont=' + window.location.pathname).subscribe(data => {
			 
			 
		 if (data.cont!="")
		 {
			  this.isTscont = true;
			  this.seocont = data.cont;
		 }
		 
		 });



     }
	  


  }

  public ngOnInit(): void {
    this.bs.startUrl = this.url;
    this.bs.background = this.background;
	//this.headerTitle ="test";
  }
}
