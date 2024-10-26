import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedBackService } from '../../../../_services/back/feed-back.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { BannerPhotos, MainBanner } from '../../../../_models/main-banner';
import { Router } from '@angular/router';
import { SortOrderService } from '../../../../_services/front/sort-order.service';

@Component({
  selector: 'flower-valley-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent {
  public reviewGroup: FormGroup;
  public isLoading: boolean = false;
  private addedPhotos: File[] = [];
  private deleteIds: number[] = [];
  public currentPhotos: BannerPhotos[] = [];
  constructor(
    private fb: FormBuilder,
    private reviewService: FeedBackService,
    private sortOrder: SortOrderService<BannerPhotos>,
    private router: Router,
  ) {
    this.reviewGroup = fb.group({
      autoPlay: [null, Validators.required],
      isUserCanLeaf: [false, Validators.required],
    });
    const data = sessionStorage.getItem('reviews');
    if (data) {
      const review: MainBanner<unknown> = JSON.parse(data);
      this.reviewGroup.patchValue(review);
      this.currentPhotos = review.photos.sort((a, b) => a.sortOrder - b.sortOrder);
    }
  }

  public editReview(): void {
    if (isFormInvalid(this.reviewGroup)) return;
    this.isLoading = true;
    const review = this.reviewGroup.getRawValue();
    const formData = new FormData();
    this.addedPhotos.map((photo) => {
      formData.append('photos[]', photo);
    });
    this.deleteIds.map((id) => {
      formData.append('deleteIds[]', id.toString());
    });
    formData.append('autoPlay', review.autoPlay);
    formData.append('isUserCanLeaf', review.isUserCanLeaf);
    this.reviewService.addItem(formData).subscribe(() => {
      this.isLoading = false;
      sessionStorage.removeItem('reviews');
      this.router.navigate([''], { fragment: 'reviews' });
    });
  }

  public filesUploaded(photos: File[]) {
    this.addedPhotos = photos;
  }

  public removePhoto(id: number): void {
    this.deleteIds.push(id);
    const i = this.currentPhotos.findIndex((photo) => photo.id === id);
    this.currentPhotos.splice(i, 1);
  }

  public dragStart(draggedItem: BannerPhotos, i: number): void {
    this.sortOrder.dragStart(this.currentPhotos, draggedItem, i);
  }
  public dragEnd(): void {
    this.currentPhotos = this.sortOrder.dragEnd(this.currentPhotos);
  }
  public drop(): void {
    this.reviewService.setOrder(this.sortOrder.drop(this.currentPhotos)).subscribe();
  }
  public setPosition(index: number): void {
    this.currentPhotos = this.sortOrder.setPosition(this.currentPhotos, index);
  }
}
