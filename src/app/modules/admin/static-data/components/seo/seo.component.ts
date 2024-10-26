import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { slugify } from 'transliteration';

@Component({
  selector: 'flower-valley-seo',
  templateUrl: './seo.component.html',
  styleUrls: ['./seo.component.scss'],
})
export class SeoComponent implements OnInit {

   public variablesForm: FormGroup;
   public h1Form: FormGroup;
   public contForm: FormGroup;
   public roboForm: FormGroup;
   public mapForm: FormGroup;
   public tulp: any; 
   public rass: any;
   public url: any; 
   public urlh: any;
   public h1: any;
   public tit: any; 
   public keyw: any; 
   public desc: any; 
   public str: any;
   public str2: any;
   public str3: any;
   public str4: any;
   public str5: any;
   public tulpc: any;
   public rassc: any;
   public robo: any; 
		
   public listUsers: string[] = [];

  constructor(private http: HttpClient) {

	  this.str = "";
	  this.str2 = "";
	  this.str3 = "";
	  this.str4 = "";
	  this.str5 = "";


	
		

	  
 
	  this.variablesForm = new FormGroup({ 
         url: new FormControl(null),
		 tit: new FormControl(null),
		 keyw: new FormControl(null),
		 desc: new FormControl(null)
      }); 

		  this.h1Form = new FormGroup({ 
         urlh: new FormControl(null),
		 h1: new FormControl(null)
      }); 

		   this.contForm = new FormGroup({ 
         tulp: new FormControl(),
			 rass: new FormControl()
      }); 

		   this.roboForm = new FormGroup({ 
         robo: new FormControl()
      }); 

		   this.mapForm = new FormGroup({ 
         
      }); 


  }

  ngOnInit(): void {

	

	     this.http.get<any>('https://flowervalley.ru/back/seo_api.php?tscont=/seedlings').subscribe(data => {
			 this.contForm.get('rass')?.setValue(data.cont);
	   
	   });

	     this.http.get<any>('https://flowervalley.ru/back/seo_api.php?tscont=/tulips').subscribe(data => {
	   
	    this.contForm.get('tulp')?.setValue(data.cont);
	   
	   });

	     this.http.get<any>('https://flowervalley.ru/back/seo_api.php?grobo=1').subscribe(data => {
	   
	    this.roboForm.get('robo')?.setValue(decodeURIComponent(data.res));
	   
	   });


	    
   
  }

    saveOthers(data: any) {
		


		  this.http.post('https://flowervalley.ru/back/seo_api.php', { url: data.url, tit: data.tit, keyw: data.keyw, desc: data.desc }).subscribe(data => {

			  console.log(data)
				  this.str = "Данные успешно добавлены";
           });
		}


		saveh1(data: any) {
			this.http.post('https://flowervalley.ru/back/seo_api.php',  { urlh: data.urlh, h1: data.h1 }).subscribe(data => {
			this.str2 = "Данные успешно добавлены";
           });
		}

		savecont(data: any) {
			this.http.post('https://flowervalley.ru/back/seo_api.php',  { tulp: data.tulp, rass: data.rass}).subscribe(data => {
			this.str3 = "Данные успешно добавлены";
           });
		}

		saverobo(data: any) {
			this.http.post('https://flowervalley.ru/back/seo_api.php',  { robo: data.robo}).subscribe(data => {
			this.str4 = "Данные успешно добавлены";
           });
		}


			savemap(data: any) {
			 this.http.get<any>('https://flowervalley.ru/back/category/list').subscribe(data => {
	   
	   //console.log(data);

 for(const prop in data) {
    //  console.log(data[prop].isTulip + " / " + slugify(data[prop].name));

	  if (data[prop].isTulip==true)
	  
		  this.listUsers.push("<url><loc>https://flowervalley.ru/tulips</loc></url>");
	  else
		  this.listUsers.push("<url><loc>https://flowervalley.ru/" + slugify(data[prop].name) + "</loc></url>");

      
    }

	  this.http.post('https://flowervalley.ru/back/seo_api.php', { sitemap: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>https://flowervalley.ru/catalog</loc></url>\n' + this.listUsers.join("\n") + '</url>\n<url><loc>https://flowervalley.ru/contacts</loc></url>\n</urlset>\n' }).subscribe(data => {

			  console.log(data)
				  this.str5 = "Карта успешно сгенерирована";
           });



	//  console.log(this.listUsers.join("\n"));
	   
	   });
		}


}
