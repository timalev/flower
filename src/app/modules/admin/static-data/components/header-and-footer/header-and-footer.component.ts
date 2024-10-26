import { Component, OnInit } from '@angular/core';
import { StaticDataService } from '../../../../../_services/back/static-data.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';
import { AdminFooter, Header } from '../../../../../_models/static-data/header';
import { LoadingService } from '../../../../../_services/front/loading.service';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';

type ArrayTypes = 'workTime' | 'address' | 'phones';

@Component({
  selector: 'flower-valley-header-and-footer',
  templateUrl: './header-and-footer.component.html',
  styleUrls: ['./header-and-footer.component.scss'],
})
export class HeaderAndFooterComponent implements OnInit {
  public headerForm: FormGroup;
  public footerForm: FormGroup;
  public isHeaderLoading: boolean = false;
  public isFooterLoading: boolean = false;
  private photo: File | undefined;
  constructor(
    private fb: FormBuilder,
    private ls: LoadingService,
    private ms: MessageService,
    private staticData: StaticDataService,
  ) {
    this.headerForm = fb.group({
      img: ['', Validators.required],
      title: ['', Validators.required],
      subTitle: ['', Validators.required],
      workTime: fb.array([fb.control('', Validators.required)]),
      address: fb.array([fb.control('', Validators.required)]),
      whatsAppNumber: ['', Validators.required],
      phone: ['', Validators.required],
      mail: ['', Validators.required],
    });
    this.footerForm = fb.group({
      roots: ['', Validators.required],
      phones: fb.array([fb.control('', Validators.required)]),
    });
  }

  ngOnInit(): void {
    const requests = [this.staticData.getHeaderContent(), this.staticData.getAdminFooterContent()];
    const sub = forkJoin(requests).subscribe(([header, footer]) => {
      this.patchValue(header, this.headerForm);
      this.patchValue(footer, this.footerForm);
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  private patchValue(data: Header | AdminFooter, formGroup: FormGroup): void {
    for (const key in data) {
      // @ts-ignore
      const value = data[key];
      if (value instanceof Array) {
        if (value.length > 1) {
          for (let i = 1; i < value.length; i++) {
            this.addControlToArray(formGroup, key as ArrayTypes);
          }
        }
      }
    }
    formGroup.patchValue(data);
  }

  public saveHeader(): void {
    if (isFormInvalid(this.headerForm)) return;
    this.isHeaderLoading = true;
    if (this.photo) {
      const formData = new FormData();
      const oldImg = this.headerForm.controls['img'].value;
      formData.append('file', this.photo);
      formData.append('removeUrl', oldImg);
      this.staticData.uploadFile(formData).subscribe((res) => {
        this.headerForm.controls['img'].setValue(res);
        this.saveHeaderRequest();
      });
    } else {
      this.saveHeaderRequest();
    }
  }

  private saveHeaderRequest(): void {
    const header = this.headerForm.getRawValue();
    this.headerForm.disable();
    this.staticData.setHeaderContent(header).subscribe(() => {
      this.headerForm.enable();
      this.isHeaderLoading = false;
      this.ms.add({
        severity: 'success',
        summary: 'Запрос выполнен',
        detail: 'Данные успешно обновлены',
      });
    });
  }

  public saveFooter(): void {
    if (isFormInvalid(this.footerForm)) return;
    this.isFooterLoading = true;
    const footer = this.footerForm.getRawValue();
    this.footerForm.disable();
    this.staticData.setFooterContent(footer).subscribe(() => {
      this.footerForm.enable();
      this.isFooterLoading = false;
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

  public getControlArray(formGroup: FormGroup, control: ArrayTypes): FormArray {
    return formGroup.controls[control] as FormArray;
  }

  public getFormControl(item: AbstractControl): FormControl {
    return item as FormControl;
  }

  public addControlToArray(formGroup: FormGroup, formArray: ArrayTypes, values?: string[]): void {
    const control = this.fb.control('', Validators.required);
    if (values?.length) {
      values.map((value) => {
        control.patchValue(value);
      });
    }
    this.getControlArray(formGroup, formArray).push(control);
  }

  public deleteArrayControl(formGroup: FormGroup, formArray: ArrayTypes, index: number): void {
    this.getControlArray(formGroup, formArray).removeAt(index);
  }

  public isFormArrayValid(formGroup: FormGroup, formArray: ArrayTypes): boolean {
    return this.getControlArray(formGroup, formArray).status === 'VALID';
  }
}
