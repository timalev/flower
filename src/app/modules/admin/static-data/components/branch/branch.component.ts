import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { slugify } from 'transliteration';

@Component({
  selector: 'flower-valley-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
})
export class BranchComponent implements OnInit {

	  fileName = '';
	  public strImg: any;
	  public strImg2: any;
	  public strImg3: any;
	  public strImg4: any;
	  public strImg5: any;
	  public strImg6: any;
	  public strImg7: any;
	  public strImg8: any;
	  public strImg9: any;
	  public strImg10: any;
	  public strImg11: any;
	  public vprog: string;
	  public iprog: string;
	  public str: string;
	  public blockForm: FormGroup;
	  public blc1: any; 
	  public blc2: any;
	  public blc3: any;



    constructor(private http: HttpClient) {
		this.strImg = "";
		this.strImg2 = "";
		this.strImg3 = "";
		this.strImg4 = "";
		this.strImg5 = "";
		this.strImg6 = "";
		this.strImg7 = "";
		this.strImg8 = "";
		this.strImg9 = "";
		this.strImg10 = "";
		this.strImg11 = "";
		this.vprog = "";
		this.iprog = "";
		this.str = "";
		

		 this.blockForm = new FormGroup({
			 blc1: new FormControl(),
			 blc2: new FormControl(),
			 blc3: new FormControl(),
      }); 

	}

    onFileSelected(event: any, id: string) {

        const file:File = event.target.files[0];

        if (file) {

			if (id=='9' || id=='10' || id=='11')
			{
				this.vprog = "идет размещение видео..";
			}
			if (id=='1' || id=='2' || id=='3'|| id=='4'|| id=='5'|| id=='6'|| id=='7'|| id=='8')
			{
				this.iprog = "идет размещение фото..";
			}




            this.fileName = file.name;

            const formData = new FormData();

            formData.append("thumbnail", file);
			//formData.append("id", id);

			  this.http.post<any>("https://flowervalley.ru/back/branch_api.php?id=" + id, formData).subscribe(data => {

				  switch (id)
				  {
				  case '1':
					  this.strImg = data.res;
				      this.iprog = "фото размещено!";
				  break;

				  case '2':
					  this.strImg2 = data.res;
				      this.iprog = "фото размещено!";
				  break;
				  case '3':
					  this.strImg3 = data.res;
				      this.iprog = "фото размещено!";
				  break;
				  case '4':
					  this.strImg4 = data.res;
				  this.iprog = "фото размещено!";
				  break;
				  case '5':
					  this.strImg5 = data.res;
				      this.iprog = "фото размещено!";
				  break;
				  case '6':
					  this.strImg6 = data.res;
				      this.iprog = "фото размещено!";
				  break;
				  case '7':
					  this.strImg7 = data.res;
				      this.iprog = "фото размещено!";
				  break;

				  case '8':
					  this.strImg8 = data.res;
				      this.iprog = "фото размещено!";
				  break;
				   case '9':
					  this.strImg9 = data.res;
				      this.vprog = "видео размещено!";
				  break;
				  case '10':
					  this.strImg10 = data.res;
				      this.vprog = "видео размещено!";
				  break;
				  default:
					  this.strImg11 = data.res;
				      this.vprog = "видео размещено!";
				  
				  }
				  

			  console.log(data)
				 
           });



       
        }
    }

	
  ngOnInit(): void {

	    this.http.get<any>('https://flowervalley.ru/back/branch_api.php?cont=1').subscribe(data => {
		
		//console.log(data);
		 this.strImg = data[0].img;
		 this.strImg2 = data[1].img;
		 this.strImg3 = data[2].img;
		 this.strImg4 = data[3].img;
		 this.strImg5 = data[4].img;
		 this.strImg6 = data[5].img;
		 this.strImg7 = data[6].img;
		 this.strImg8 = data[7].img;
		 this.strImg9 = data[8].img;
		 this.strImg10 = data[9].img;
		 this.strImg11 = data[10].img;
	   
	   },error =>{ console.log("err");});


	    this.http.get<any>('https://flowervalley.ru/back/branch_api.php?blocks=1').subscribe(data => {

			//console.log(data);
	   
	    this.blockForm.get('blc1')?.setValue(data[0].blc1);
		this.blockForm.get('blc2')?.setValue(data[0].blc2);
		this.blockForm.get('blc3')?.setValue(data[0].blc3);
	   
	   });





  };

    saveBlock1(data: any) {


		  this.http.post('https://flowervalley.ru/back/branch_api.php', { blc1: data.blc1, blc2: data.blc2, blc3: data.blc3}).subscribe(data => {

			  console.log(data)
				  this.str = "Данные успешно добавлены";
           });


		};
		

}
