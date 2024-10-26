import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaticDataService } from '../../../../../_services/back/static-data.service';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';
import { LoadingService } from '../../../../../_services/front/loading.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'flower-valley-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss'],
})
export class OtherComponent implements OnInit {
  public variablesForm: FormGroup;
  public isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ls: LoadingService,
    private ms: MessageService,
    private staticData: StaticDataService,
  ) {
    this.variablesForm = fb.group({
      minOrderSum: [null, Validators.required],
      // nearestDelivery: [null, Validators.required],
      // middleDelivery: [null, Validators.required],
      moscowDelivery: [null, Validators.required],
      deliveryPerKm: [null, Validators.required],
      mobileWhatsApp: ['', Validators.required],
      mobilePhone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const sub = this.staticData.getVariables().subscribe((data) => {
      this.variablesForm.patchValue(data);
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public saveOthers(): void {
    if (isFormInvalid(this.variablesForm)) return;
    this.variablesForm.disable();
    this.isLoading = true;
    const vars = this.variablesForm.getRawValue();
    this.staticData.setVariables(vars).subscribe(() => {
      this.variablesForm.enable();
      this.isLoading = false;
      this.ms.add({
        severity: 'success',
        summary: 'Запрос выполнен',
        detail: 'Данные успешно обновлены',
      });
    });
  }
}
