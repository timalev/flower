import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../../_services/back/client.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { Router } from '@angular/router';
import { BannerPhotos, MainBanner } from '../../../../_models/main-banner';
import { SortOrderService } from '../../../../_services/front/sort-order.service';

@Component({
  selector: 'flower-valley-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent {
  public clientGroup: FormGroup;
  public isLoading: boolean = false;
  private addedPhotos: File[] = [];
  private deleteIds: number[] = [];
  public currentPhotos: BannerPhotos[] = [];
  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private sortOrder: SortOrderService<BannerPhotos>,
    private router: Router,
  ) {
    this.clientGroup = fb.group({
      autoPlay: [null, Validators.required],
      isUserCanLeaf: [false, Validators.required],
    });
    const data = sessionStorage.getItem('clients');
    if (data) {
      const clients: MainBanner<unknown> = JSON.parse(data);
      this.clientGroup.patchValue(clients);
      this.currentPhotos = clients.photos.sort((a, b) => a.sortOrder - b.sortOrder);
    }
  }

  public editClient(): void {
    if (isFormInvalid(this.clientGroup)) return;
    this.isLoading = true;
    const review = this.clientGroup.getRawValue();
    const formData = new FormData();
    this.addedPhotos.map((photo) => {
      formData.append('photos[]', photo);
    });
    this.deleteIds.map((id) => {
      formData.append('deleteIds[]', id.toString());
    });
    formData.append('autoPlay', review.autoPlay);
    formData.append('isUserCanLeaf', review.isUserCanLeaf);
    this.clientService.addItem(formData).subscribe(() => {
      this.isLoading = false;
      sessionStorage.removeItem('clients');
      this.router.navigate([''], { fragment: 'clients' });
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
    this.clientService.setOrder(this.sortOrder.drop(this.currentPhotos)).subscribe();
  }
  public setPosition(index: number): void {
    this.currentPhotos = this.sortOrder.setPosition(this.currentPhotos, index);
  }
}
