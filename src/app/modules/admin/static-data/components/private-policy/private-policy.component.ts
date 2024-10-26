import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';
import { LoadingService } from '../../../../../_services/front/loading.service';
import { MessageService } from 'primeng/api';
import { StaticDataService } from '../../../../../_services/back/static-data.service';

@Component({
  selector: 'flower-valley-private-policy',
  templateUrl: './private-policy.component.html',
  styleUrls: ['./private-policy.component.scss'],
})
export class PrivatePolicyComponent implements OnInit {
  public policyForm: FormGroup;
  public isLoading = false;
  constructor(
    private fb: FormBuilder,
    private ls: LoadingService,
    private ms: MessageService,
    private staticData: StaticDataService,
  ) {
    this.policyForm = fb.group({
      title: [null],
      text: [null],
    });
  }

  ngOnInit(): void {
    const sub = this.staticData.getPrivatePolicyContent().subscribe((data) => {
      this.policyForm.patchValue(data);
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public savePolicy(): void {
    if (isFormInvalid(this.policyForm)) return;
    this.isLoading = true;
    const privatePolicy = this.policyForm.getRawValue();
    this.policyForm.disable();
    this.staticData.setPrivatePolicyContent(privatePolicy).subscribe(() => {
      this.policyForm.enable();
      this.isLoading = false;
      this.ms.add({
        severity: 'success',
        summary: 'Запрос выполнен',
        detail: 'Данные успешно обновлены',
      });
    });
  }
}
