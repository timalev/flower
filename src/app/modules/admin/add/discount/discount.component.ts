import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { Discount } from '../../../../_models/discount';
import { DiscountService } from '../../../../_services/back/discount.service';

@Component({
  selector: 'flower-valley-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
})
export class DiscountComponent {
  public discountForm: FormGroup;
  public isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private discountService: DiscountService,
    private router: Router,
  ) {
    this.discountForm = fb.group({
      discount: [null, Validators.required],
      sum: [null, Validators.required],
    });
  }

  public saveDiscount(): void {
    if (isFormInvalid(this.discountForm)) return;
    const discount = this.discountForm.getRawValue();
    this.isLoading = true;
    this.discountForm.disable();
    this.discountService.addItem<Discount>(discount).subscribe(() => {
      this.isLoading = false;
      this.router.navigate(['admin/discount']);
    });
  }
}
