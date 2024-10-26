import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../../../_services/front/loading.service';
import { MessageService } from 'primeng/api';
import { StaticDataService } from '../../../../../_services/back/static-data.service';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';

@Component({
  selector: 'flower-valley-download-invoice',
  templateUrl: './download-invoice.component.html',
  styleUrls: ['./download-invoice.component.scss'],
})
export class DownloadInvoiceComponent implements OnInit {
  public dataForm: FormGroup;
  public isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ls: LoadingService,
    private ms: MessageService,
    private staticData: StaticDataService,
  ) {
    this.dataForm = fb.group({
      title: ['', Validators.required],
      text: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const sub = this.staticData.getDownloadInvoiceContent().subscribe((data) => {
      this.dataForm.patchValue(data);
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public saveOthers(): void {
    if (isFormInvalid(this.dataForm)) return;
    this.dataForm.disable();
    this.isLoading = true;
    const data = this.dataForm.getRawValue();
    this.staticData.setDownloadInvoiceContent(data).subscribe(() => {
      this.dataForm.enable();
      this.isLoading = false;
      this.ms.add({
        severity: 'success',
        summary: 'Запрос выполнен',
        detail: 'Данные успешно обновлены',
      });
    });
  }
}
