import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StaticDataService } from '../../../../../_services/back/static-data.service';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';
import { LoadingService } from '../../../../../_services/front/loading.service';
import { MessageService } from 'primeng/api';
import { Cart } from '../../../../../_models/static-data/cart';

type ArrayTypes = 'address' | 'phones' | 'mail';

@Component({
  selector: 'flower-valley-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  public cartForm: FormGroup;
  public isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ls: LoadingService,
    private ms: MessageService,
    private staticData: StaticDataService,
  ) {
    this.cartForm = fb.group({
      minSumTitle: ['', Validators.required],
      minSumInfo: ['', Validators.required],
      infoText: ['', Validators.required],
      address: fb.array([fb.control('', Validators.required)]),
      phones: fb.array([fb.control('', Validators.required)]),
      mail: fb.array([fb.control('', Validators.required)]),
      callText: ['', Validators.required],
      writeText: ['', Validators.required],
      boxesTitle: ['', Validators.required],
      boxesNotice: ['', Validators.required],
      paymentInfo: ['', Validators.required],
      bannerTitle: ['', Validators.required],
      leftBannerBlock: fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
      }),
      centerBannerBlock: fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
      }),
      rightBannerBlock: fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    const sub = this.staticData.getCartContent().subscribe((data) => {
      this.patchValue(data);
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public saveCart(): void {
    if (isFormInvalid(this.cartForm)) return;
    this.isLoading = true;
    this.cartForm.disable();
    const cart = this.cartForm.getRawValue();
    this.staticData.setCartContent(cart).subscribe(() => {
      this.cartForm.enable();
      this.isLoading = false;
      this.ms.add({
        severity: 'success',
        summary: 'Запрос выполнен',
        detail: 'Данные успешно обновлены',
      });
    });
  }

  private patchValue(cart: Cart): void {
    for (const key in cart) {
      // @ts-ignore
      const value = cart[key];
      if (value instanceof Array) {
        if (value.length > 1) {
          for (let i = 1; i < value.length; i++) {
            this.addControlToArray(key as ArrayTypes);
          }
        }
      }
    }
    this.cartForm.patchValue(cart);
  }

  public getControlArray(control: ArrayTypes): FormArray {
    return this.cartForm.controls[control] as FormArray;
  }

  public getFormControl(item: AbstractControl): FormControl {
    return item as FormControl;
  }

  public addControlToArray(formArray: ArrayTypes, values?: string[]): void {
    const control = this.fb.control('', Validators.required);
    if (values?.length) {
      values.map((value) => {
        control.patchValue(value);
      });
    }
    this.getControlArray(formArray).push(control);
  }

  public deleteArrayControl(formArray: ArrayTypes, index: number): void {
    this.getControlArray(formArray).removeAt(index);
  }

  public isFormArrayValid(formArray: ArrayTypes): boolean {
    return this.getControlArray(formArray).status === 'VALID';
  }
}
