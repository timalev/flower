import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SEOService {

  constructor(private title: Title, private meta: Meta,private http: HttpClient) {
 
  }

  public updateTitle(title: string, isMain = false) {

	    this.http.get<any>('https://flowervalley.ru/back/seo_api.php?metas=' + window.location.pathname).subscribe(data => {

		if (data.title!="")
			this.title.setTitle(data.title);
		else  
			this.title.setTitle(`${title}${!isMain ? ' | Агрофирма Цветочная Долина' : ''}`);
	   });
  }

  public updateKeywords(keywords: string) {

	     this.http.get<any>('https://flowervalley.ru/back/seo_api.php?metas=' + window.location.pathname).subscribe(data => {

		if (data.keywords!="")
			 this.meta.updateTag({ name: 'keywords', content: data.keywords });
		else  
			this.meta.updateTag({ name: 'keywords', content: keywords });
	   });

    
  }

  public updateDescription(desc: string) {
	  	  
	  this.http.get<any>('https://flowervalley.ru/back/seo_api.php?metas=' + window.location.pathname).subscribe(data => {

	  if (data.descriptions!="")
			   this.meta.updateTag({ name: 'description', content: data.descriptions });
		else  
			  this.meta.updateTag({ name: 'description', content: desc });
	   });

  
  }
}
