import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../../_models/category';
import { MainBannerService } from '../../../../_services/back/main-banner.service';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { BannerPhotos, MainBanner } from '../../../../_models/main-banner';
import { slugify } from 'transliteration';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { Router } from '@angular/router';
import { LoadingService } from '../../../../_services/front/loading.service';
import { SortOrderService } from '../../../../_services/front/sort-order.service';

@Component({
  selector: 'flower-valley-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
  public bannerGroup: FormGroup;
  public catalog: Category[] = [];
  public isLoading: boolean = false;
  public photos: File[] = [];
  private deleteIds: number[] = [];
  public photosLinks: BannerPhotos[] = [];
  constructor(
    private fb: FormBuilder,
    private mainBannerService: MainBannerService,
    private sortOrder: SortOrderService<BannerPhotos>,
    private catalogService: CatalogService,
    private ls: LoadingService,
    private router: Router,
  ) {
    this.bannerGroup = fb.group({
      id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      label: ['', Validators.required],
      routerLink: ['', Validators.required],
      autoPlay: ['', Validators.required],
      isUserCanLeaf: [false, Validators.required],
    });
  }

  public ngOnInit(): void {
    const sub = this.catalogService.getItems().subscribe((catalog) => {
      this.catalog = catalog;
      let banner: MainBanner<unknown>;
      let data = sessionStorage.getItem('banner');
      if (data) {
        banner = JSON.parse(data);
        this.photosLinks = banner.photos || [];
        this.bannerGroup.patchValue(banner);
        const link = catalog.find((category) => slugify(category.name) === banner.routerLink);
        this.bannerGroup.get('routerLink')?.setValue(link?.name);
      }
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public editBanner(): void {
    if (isFormInvalid(this.bannerGroup)) return;
    this.isLoading = true;
    const banner = this.bannerGroup.getRawValue();
    const formData = new FormData();
    Object.getOwnPropertyNames(banner).map((key) => {
      // @ts-ignore
      let value = banner[key];
      if (key === 'routerLink') {
        const id = banner[key];
        if (id === 1) {
          value = 'tulips';
        } else {
          const name = this.catalog.find((item) => item.id === id)?.name;
          if (name) value = slugify(name);
        }
      }
      formData.append(key, value);
    });
    if (this.photos.length) {
      this.photos.map((photo) => formData.append('photos[]', photo));
    }
    this.deleteIds.map((id) => {
      formData.append('deleteIds[]', id.toString());
    });
    this.mainBannerService.updateItem(formData).subscribe(() => {
      this.isLoading = false;
      sessionStorage.removeItem('banner');
      this.router.navigate(['']);
    });
  }

  public uploadFiles(files: File[]): void {
    this.photos = files;
  }

  public removePhoto(id: number): void {
    this.deleteIds.push(id);
    const i = this.photosLinks.findIndex((photo) => photo.id === id);
    this.photosLinks.splice(i, 1);
  }

  public dragStart(draggedItem: BannerPhotos, i: number): void {
    this.sortOrder.dragStart(this.photosLinks, draggedItem, i);
  }
  public dragEnd(): void {
    this.photosLinks = this.sortOrder.dragEnd(this.photosLinks);
  }
  public drop(): void {
    this.mainBannerService.setOrder(this.sortOrder.drop(this.photosLinks)).subscribe();
  }
  public setPosition(index: number): void {
    this.photosLinks = this.sortOrder.setPosition(this.photosLinks, index);
  }
}
