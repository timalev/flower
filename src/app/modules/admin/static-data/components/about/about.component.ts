import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';
import { StaticDataService } from '../../../../../_services/back/static-data.service';
import { MessageService } from 'primeng/api';
import { LoadingService } from '../../../../../_services/front/loading.service';

@Component({
  selector: 'flower-valley-static-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  public isLoading = false;
  public aboutForm: FormGroup;
  private photo: File | undefined;
  constructor(
    private fb: FormBuilder,
    private ls: LoadingService,
    private ms: MessageService,
    private staticData: StaticDataService,
  ) {
    this.aboutForm = fb.group({
      img: ['', Validators.required],
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public ngOnInit(): void {
    const sub = this.staticData.getAboutContent().subscribe((data) => {
      this.aboutForm.patchValue(data);
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public saveAbout(): void {
    if (isFormInvalid(this.aboutForm)) return;
    this.isLoading = true;
    if (this.photo) {
      const formData = new FormData();
      const oldImg = this.aboutForm.controls['img'].value;
      formData.append('file', this.photo);
      formData.append('removeUrl', oldImg);
      this.staticData.uploadFile(formData).subscribe((res) => {
        this.aboutForm.get('img')?.setValue(res);
        this.saveAboutRequest();
      });
    } else {
      this.saveAboutRequest();
    }
  }

  private saveAboutRequest(): void {
    const about = this.aboutForm.getRawValue();
    this.aboutForm.disable();
    this.staticData.setAboutContent(about).subscribe(() => {
      this.aboutForm.enable();
      this.isLoading = false;
      this.ms.add({
        severity: 'success',
        summary: 'Запрос выполнен',
        detail: 'Данные успешно обновлены',
      });
    });
  }

  public photoUploaded(photos: File[]): void {
    this.photo = photos[0];
  }
}
