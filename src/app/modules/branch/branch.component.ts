import { Component, HostListener, OnInit } from '@angular/core';
import { BreadcrumbService } from '../../components/breadcrumb/breadcrumb.service';
import { AdminService } from '../../_services/back/admin.service';
import { HttpClient } from '@angular/common/http';

import { Video } from '../../_models/video';
//import { ContactsService } from '../../_services/back/contacts.service';
//import { ConfirmationService, MessageService } from 'primeng/api';
//import { DomSanitizer } from '@angular/platform-browser';
//import { IdImg } from '../../_models/_idImg';
//import { LoadingService } from '../../_services/front/loading.service';
//import { StaticDataService } from '../../_services/back/static-data.service';
//import { AddressData, Branch } from '../../_models/static-data/branch';
//import { SortOrderService } from '../../_services/front/sort-order.service';

import { LightgalleryModule } from 'lightgallery/angular/13';
import lgZoom from 'lightgallery/plugins/zoom';
import lgVideo from 'lightgallery/plugins/video';

import { BeforeSlideDetail } from 'lightgallery/lg-events';

@Component({
  selector: 'flower-valley-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
})
export class BranchComponent implements OnInit {
  public isAdmin: boolean = false;
 // public branch: Branch | undefined;

  //public photos: IdImg[] = [];

/*
  {
    "id": 4,
    "src": "https://youtube.com/embed/mueAlhkQaDs",
    "title": "НТВ ОБ АГРОФИРМЕ ЦВЕТОЧНАЯ ДОЛИНА | РАССАДА ЦВЕТОВ 2017Г",
    "description": "Ежегодно мы выращиваем 240 тысяч тюльпанов, которые выгоняются из лучших голландских луковиц размера 12+ . Наша традиция – выращивание отборного, качественного тюльпана. ",
    "sortOrder": 0
}
*/

   contArray: Array<{img: string; txt: string; mediaType: string, photosWidth: string; id: number;}> = [];
   videos: Array<{id: number; src: string; title: string, description: string; sortOrder: number;}> = [];

   public vid1: any;
   public vid2: any;
   public vid3: any;


   public img1: any;
   public img2: any;

   public block1: any;
   public block2: any;
   public block3: any;


 
public displayCustom: boolean = false;
     public activeIndex: number = 0;
   

  

  constructor(private _bs: BreadcrumbService, private http: HttpClient) {
	    _bs.setItem('Новый филиал');

		  this.vid1 = "";
		  this.vid2 = "";
		  this.vid3 = "";

		  this.img1 = "";
		  this.img2 = "";

		  this.block1 = "";
		  this.block2 = "";
		  this.block3 = "";
   
  }

  public ngOnInit(): void {


	  this.http.get<any>('https://flowervalley.ru/back/branch_api.php?blocks=1').subscribe(data => {
	   
	    this.block1 = data[0].blc1;
		this.block2 = data[0].blc2;
		this.block3 = data[0].blc3;
		
	   });

  this.http.get<any>('https://flowervalley.ru/back/branch_api.php?cont=bra_cont_vid').subscribe(data => {

//console.log(data.length);
			// this.strImg = data.img;

			for (let i=0; i<data.length; i++)
			{
			
				 
					this.videos.push({
						id: data[i].id, 
						src: 'https://flowervalley.ru/back/Uploads/' + data[i].img,
						title: data[i].text,
						description: "",
						sortOrder: data[i].sort
						});
				
			}


			  });





			   this.http.get<any>('https://flowervalley.ru/back/branch_api.php?cont=bra_cont').subscribe(data => {

//console.log(data.length);
			// this.strImg = data.img;

			for (let i=0; i<data.length; i++)
			{
				//console.log(data[i]);

				
				this.contArray.push({img: 'https://flowervalley.ru/back/Uploads/' + data[i].img, txt:data[i].text, mediaType:data[i].mediaType, photosWidth: '350', id: i});
				
				
			}


			  });


			  //console.log(this.contArray);
  
  };
    public openImage(id: number): void {
    this.activeIndex = this.contArray.findIndex((photo) => photo.id === id);
    this.displayCustom = true;
  };

   settings = {
    counter: false,
    plugins: [lgZoom,lgVideo]
  };
	  onBeforeSlide = (detail: BeforeSlideDetail): void => {
    const { index, prevIndex } = detail;
    console.log(index, prevIndex);
  };

 
}
