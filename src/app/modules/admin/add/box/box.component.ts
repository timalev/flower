import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoxService } from '../../../../_services/back/box.service';
import { isFormInvalid } from '../../../../_utils/formValidCheck';
import { Box } from '../../../../_models/box';
import { Router } from '@angular/router';

@Component({
  selector: 'flower-valley-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
})
export class BoxComponent {
  public boxesForm: FormGroup;
  public isLoading: boolean = false;

  constructor(private fb: FormBuilder, private boxService: BoxService, private router: Router) {
    this.boxesForm = fb.group({
      name: ['', Validators.required],
      volume: [null, Validators.required],
      price: [null, Validators.required],
    });
  }

  public saveBox(): void {
    if (isFormInvalid(this.boxesForm)) return;
    const box = this.boxesForm.getRawValue();
    this.isLoading = true;
    this.boxesForm.disable();
    this.boxService.addItem<Box>(box).subscribe(() => {
      this.isLoading = false;
      this.router.navigate(['admin/boxes']);
    });
  }
}
