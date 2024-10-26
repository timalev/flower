import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Media } from '../../../../_models/media';
import { MediaService } from '../../../../_services/back/media.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../../../_services/front/loading.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';

@Component({
  selector: 'flower-valley-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})
export class MediaComponent implements OnInit {
  public mediaForm: FormGroup;
  public media: Media | undefined;
  public id: number = 0;
  public currentDate = new Date();
  constructor(
    private fb: FormBuilder,
    private mediaService: MediaService,
    private route: ActivatedRoute,
    private router: Router,
    private ls: LoadingService,
  ) {
    this.mediaForm = fb.group({
      img: [''],
      title: ['', Validators.required],
      link: ['', Validators.required],
      publishDate: ['', Validators.required],
    });
    route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  public ngOnInit(): void {
    const sub = this.mediaService.getItemById<Media>(this.id).subscribe((media) => {
      this.media = media;
      this.mediaForm.patchValue({ ...media, publishDate: new Date(media.publishDate) });
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public editMedia(): void {
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
    const addSub = this.mediaService.updateItem<any>(formData, this.id).subscribe(() => {
      this.ls.removeSubscription(addSub);
      this.router.navigate([''], { fragment: 'media' });
    });
    this.ls.addSubscription(addSub);
  }

  public photoUploaded(photos: File[]): void {
    this.mediaForm.get('img')?.setValue(photos[0]);
  }
}
