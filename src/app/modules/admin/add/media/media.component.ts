import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingService } from '../../../../_services/front/loading.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { MediaService } from '../../../../_services/back/media.service';

@Component({
  selector: 'flower-valley-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})
export class MediaComponent {
  public mediaForm: FormGroup;
  public currentDate = new Date();
  constructor(
    private fb: FormBuilder,
    private mediaService: MediaService,
    private router: Router,
    private ls: LoadingService,
  ) {
    this.mediaForm = fb.group({
      img: [''],
      title: ['', Validators.required],
      link: ['', Validators.required],
      publishDate: ['', Validators.required],
    });
  }

  public addMedia(): void {
    if (isFormInvalid(this.mediaForm)) return;
    const media = this.mediaForm.getRawValue();
    media.publishDate.setHours(12);
    media.publishDate = media.publishDate.toISOString();
    const formData = new FormData();
    Object.getOwnPropertyNames(media).map((key) => {
      if (key !== 'img') {
        // @ts-ignore
        const value = media[key];
        formData.append(key, value);
      }
    });
    formData.append('img', media.img);
    const addSub = this.mediaService.addItem<any>(formData).subscribe(() => {
      this.ls.removeSubscription(addSub);
      this.router.navigate([''], { fragment: 'media' });
    });
    this.ls.addSubscription(addSub);
  }

  public photoUploaded(photos: File[]): void {
    this.mediaForm.get('img')?.setValue(photos[0]);
  }
}
