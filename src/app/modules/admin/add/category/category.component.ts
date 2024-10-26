import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Category } from '../../../../_models/category';
import { CatalogService } from '../../../../_services/back/catalog.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { ActivatedRoute, Router } from '@angular/router';
import { slugify } from 'transliteration';
import { StorageService } from '../../../../_services/front/storage.service';
import { categoriesKey } from '../../../../_utils/constants';
import { LoadingService } from '../../../../_services/front/loading.service';
import { Observable, tap } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'flower-valley-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent {
  public category: FormGroup;
  public categoryId?: number;
  public categories: Category[] = [];
  constructor(
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private ls: LoadingService,
    private ms: MessageService,
  ) {
    this.category = fb.group({
      name: ['', Validators.required, [this.nameAsyncValidator.bind(this)]],
      img: [''],
      parentId: [null],
      isSeedling: [false],
      isBlocked: [false],
      hasNoDiscount: [false],
    });
    route.queryParams.subscribe((params) => {
      this.categoryId = params['categoryId'];
      catalogService.getItems().subscribe((items) => {
        this.categories = items.filter((item) => !item.parentId);
        if (this.categoryId) {
          this.category.controls['parentId'].setValue(Number(this.categoryId));
        }
      });
    });
  }

  public addCategory(): void {
    if (isFormInvalid(this.category)) return;
    const category: Category = this.category.getRawValue();
    if (!category.parentId) delete category.parentId;
    const formData = new FormData();
    Object.getOwnPropertyNames(category).map((key) => {
      if (key !== 'img') {
        // @ts-ignore
        const value = category[key];
        formData.append(key, value);
      }
    });
    formData.append('img', category.img);
    const addSub = this.catalogService.addItem<any>(formData).subscribe((id) => {
      const getSub = this.catalogService.getItemById<Category>(id).subscribe((item) => {
        this.storageService.addItem<Category>(categoriesKey, item);
        this.ls.removeSubscription(getSub);
        this.router.navigate(['catalog', slugify(category.name)]);
      });
      this.ls.addSubscription(getSub);
      this.ls.removeSubscription(addSub);
    });
    this.ls.addSubscription(addSub);
  }

  public photoUploaded(photos: File[]): void {
    this.category.get('img')?.setValue(photos[0]);
  }

  public nameAsyncValidator(control: FormControl): Observable<ValidationErrors | null> {
    return this.catalogService.validateName(control.value).pipe(
      tap((value) => {
        if (value && control.dirty) {
          this.ms.add({
            severity: 'error',
            summary: 'Совпадение названия',
            detail: 'Категория с таким именем уже существует',
          });
        }
      }),
    );
  }
}
