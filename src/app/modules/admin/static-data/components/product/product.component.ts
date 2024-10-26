import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';
import { StaticDataService } from '../../../../../_services/back/static-data.service';
import { MessageService } from 'primeng/api';
import { forkJoin, Observable } from 'rxjs';
import { LoadingService } from '../../../../../_services/front/loading.service';

interface Photos {
  left: string;
  right: string;
}

interface UploadedPhotos {
  leftBlock?: File;
  rightBlock?: File;
}

@Component({
  selector: 'flower-valley-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  public productGroup: FormGroup;
  public photos: Photos | undefined;
  private uploadedPhotos: UploadedPhotos = {};
  public isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private staticData: StaticDataService,
    private ms: MessageService,
    private ls: LoadingService,
  ) {
    this.productGroup = fb.group({
      title: ['', Validators.required],
      leftBlock: fb.group({
        img: [''],
        title: ['', Validators.required],
        description: ['', Validators.required],
      }),
      rightBlock: fb.group({
        img: [''],
        title: ['', Validators.required],
        description: ['', Validators.required],
      }),
    });
  }

  public ngOnInit(): void {
    const sub = this.staticData.getProductBlockContent().subscribe((data) => {
      this.productGroup.patchValue(data);
      this.photos = {
        left: data.leftBlock?.img,
        right: data.rightBlock?.img,
      };
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public saveProductBlock(): void {
    if (isFormInvalid(this.productGroup)) return;
    this.isLoading = true;
    if (Object.keys(this.uploadedPhotos).length) {
      const requests: Observable<string>[] = [];
      const pathNames: string[] = [];
      Object.keys(this.uploadedPhotos).map((key) => {
        // @ts-ignore
        const value = this.uploadedPhotos[key];
        if (value) {
          const formData = new FormData();
          const oldImg = this.productGroup.get(key)?.get('img')?.value;
          formData.append('file', value);
          formData.append('removeUrl', oldImg);
          requests.push(this.staticData.uploadFile(formData));
          pathNames.push(key);
        }
      });
      forkJoin<string[]>(requests).subscribe((routes) => {
        for (let i = 0; i < routes.length; i++) {
          const route = routes[i];
          this.productGroup.get(pathNames[i])?.get('img')?.setValue(route);
        }
        this.saveProductBlockRequest();
      });
    } else {
      this.saveProductBlockRequest();
    }
  }

  private saveProductBlockRequest(): void {
    this.productGroup.disable();
    const productBlock = this.productGroup.getRawValue();
    this.staticData.setProductBlockContent(productBlock).subscribe(() => {
      this.productGroup.enable();
      this.isLoading = false;
      this.ms.add({
        severity: 'success',
        summary: 'Запрос выполнен',
        detail: 'Данные успешно обновлены',
      });
    });
  }

  public photoUploaded(photos: File[], path: 'leftBlock' | 'rightBlock'): void {
    this.uploadedPhotos[path] = photos[0];
  }
}
