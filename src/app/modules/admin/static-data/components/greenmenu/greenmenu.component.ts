import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { slugify } from 'transliteration';

@Component({
  selector: 'flower-valley-greenmenu',
  templateUrl: './greenmenu.component.html',
  styleUrls: ['./greenmenu.component.scss'],
})
export class GmenuComponent implements OnInit {

	  vidForm: FormGroup;



	  contArray: Array<{name: string; img: string; txt: string; mediaType: string, photosWidth: string; id: number; sortOrder: number;}> = [];
	   items: Array<{id: number; title: string; link: string; sortOrder: number;}> = [];

	  fileName = '';
	   
	  public vprog: string;
	  public iprog: string;
	  public str: string;
	  public menuForm: FormGroup;
	  public menu1: any; 
	  public menu2: any;
	  public menu3: any;



    constructor(private http: HttpClient, private fb: FormBuilder) {

		this.vidForm = this.fb.group({
			v_id: ['']
		});

	 
		this.vprog = "";
		this.iprog = "";
		this.str = "";
		

		 this.menuForm = new FormGroup({
			 menu1: new FormControl(),
			 menu2: new FormControl(),
			 menu3: new FormControl(),
      }); 

	}
	updateVidSort(id: any, sort: any, type: any)
	  {
		console.log("tima: / " + id + " / " + sort);

		  this.http.post('https://flowervalley.ru/back/branch_api.php', { item_id: id, item_sort: sort, type: type }).subscribe(data => {

			  console.log(data)
				 // this.str = "Данные успешно добавлены";
           });

		   // console.log(id + " / " + sort);
	  }


	  updateVidTitl(id: any, title: any, type: any)
	  {
		  this.http.post('https://flowervalley.ru/back/branch_api.php', { item_id: id, item_titl: title, type: type }).subscribe(data => {

			  console.log(data)
           });
	  }

	  
	  updateVidLink(id: any, link: any, type: any)
	  {
		  this.http.post('https://flowervalley.ru/back/branch_api.php', { item_id: id, item_link: link, type: type }).subscribe(data => {

			  console.log(data)
           });
	  }
	  deleteItem(i: number, id: any, type: any)
	  {
		  this.http.post('https://flowervalley.ru/back/branch_api.php', { item_delete: id, type: type }).subscribe(data => {

		  this.items.splice(i, 1);

		
           });

		  //console.log(id);
	  }





	saveVidInfo(){
		console.log(this.vidForm.value);


	}
	

    onFileSelected(event: any, id: string) {

        const file:File = event.target.files[0];

        if (file) {

			if (id=='video')
			{
				this.vprog = "идет размещение видео..";
			}
			if (id=='image')
			{
				this.iprog = "идет размещение фото..";
			}




            this.fileName = file.name;

            const formData = new FormData();

            formData.append("thumbnail", file);
			//formData.append("id", id);

			  this.http.post<any>("https://flowervalley.ru/back/branch_api.php?type=" + id, formData).subscribe(data => {

/*
				  switch (id)
				  {
				  case '1':
					  this.strImg = data.res;
				      this.iprog = "фото размещено!";
				  break;

				 
				  default:
					  this.strImg11 = data.res;
				      this.vprog = "видео размещено!";
				  
				  }
				  */

				  if (data.res)
				  {
					  this.vprog = "";
					  this.iprog = "";
				  }
				  

			  console.log(data.res)
				 
           });



       
        }
    }

	
  ngOnInit(): void {

	

	       this.http.get<any>('https://flowervalley.ru/back/branch_api.php?menuItems=1').subscribe(data => {



			
			for (let i=0; i<data.length; i++)
			{
			 

				this.items.push({
						id: data[i].id, 
						title: data[i].title,
						link: data[i].link,
						sortOrder: data[i].sort
						}); 

			 

			}

		
	 
		
	   
	   },error =>{ console.log("err");});







  };

    saveMenu(data: any) {

		if (data.menu3 == null)
		{
			data.menu3 = "0";
		}

		  this.items.push({
						id: 0, 
						title: data.menu1,
						link: data.menu2,
						sortOrder: data.menu3
						}); 


		  this.http.post('https://flowervalley.ru/back/branch_api.php', { menu1: data.menu1, menu2: data.menu2, menu3: data.menu3}).subscribe(data => {

			  console.log(data)
				  this.str = "Данные успешно добавлены";




           });


		};
		

}
