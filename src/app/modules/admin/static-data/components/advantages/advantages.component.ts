import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaticDataService } from '../../../../../_services/back/static-data.service';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';
import { MessageService } from 'primeng/api';
import { LoadingService } from '../../../../../_services/front/loading.service';
import { forkJoin, Observable } from 'rxjs';

interface Photos {
  left: string;
  center: string;
  right: string;
}

interface UploadedPhotos {
  leftBlock?: File;
  centerBlock?: File;
  rightBlock?: File;
}

@Component({
  selector: 'flower-valley-static-advantages',
  templateUrl: './advantages.component.html',
  styleUrls: ['./advantages.component.scss'],
})
export class AdvantagesComponent implements OnInit {
  public advantagesForm: FormGroup;
  public photos: Photos | undefined;
  private uploadedPhotos: UploadedPhotos = {};
  public isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private ls: LoadingService,
    private ms: MessageService,
    private staticData: StaticDataService,
  ) {
    this.advantagesForm = fb.group({
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      leftBlock: fb.group({
        img: [''],
        title: ['', Validators.required],
        description: ['', Validators.required],
      }),
      centerBlock: fb.group({
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
    const sub = this.staticData.getAdvantagesContent().subscribe((data) => {
      this.advantagesForm.patchValue(data);
      this.photos = {
        left: data.leftBlock.img,
        center: data.centerBlock.img,
        right: data.rightBlock.img,
      };
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public saveAdvantages(): void {
    if (isFormInvalid(this.advantagesForm)) return;
    this.isLoading = true;
    if (Object.keys(this.uploadedPhotos).length) {
      const requests: Observable<string>[] = [];
      const pathNames: string[] = [];
      Object.keys(this.uploadedPhotos).map((key) => {
        // @ts-ignore
        const value = this.uploadedPhotos[key];
        if (value) {
          const formData = new FormData();
          const oldImg = this.advantagesForm.get(key)?.get('img')?.value;
          formData.append('file', value);
          formData.append('removeUrl', oldImg);
          requests.push(this.staticData.uploadFile(formData));
          pathNames.push(key);
        }
      });
      forkJoin<string[]>(requests).subscribe((routes) => {
        for (let i = 0; i < routes.length; i++) {
          const route = routes[i];
          this.advantagesForm.get(pathNames[i])?.get('img')?.setValue(route);
        }
        this.saveAdvantagesRequest();
      });
    } else {
      this.saveAdvantagesRequest();
    }
  }

  private saveAdvantagesRequest(): void {
    this.advantagesForm.disable();
    const advantages = this.advantagesForm.getRawValue();
    this.staticData.setAdvantagesContent(advantages).subscribe(() => {
      this.advantagesForm.enable();
      this.isLoading = false;
      this.ms.add({
        severity: 'success',
        summary: 'Запрос выполнен',
        detail: 'Данные успешно обновлены',
      });
    });
  }

  public photoUploaded(photos: File[], path: 'leftBlock' | 'centerBlock' | 'rightBlock'): void {
    this.uploadedPhotos[path] = photos[0];
  }
}
