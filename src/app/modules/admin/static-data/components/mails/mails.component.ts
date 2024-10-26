import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaticDataService } from '../../../../../_services/back/static-data.service';
import { LoadingService } from '../../../../../_services/front/loading.service';
import { MessageService } from 'primeng/api';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';

@Component({
  selector: 'flower-valley-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss'],
})
export class MailsComponent implements OnInit {
  public mailGroup: FormGroup;
  public isLoading = false;

  constructor(
    private fb: FormBuilder,
    private staticData: StaticDataService,
    private ls: LoadingService,
    private ms: MessageService,
  ) {
    this.mailGroup = fb.group({
      signature: fb.control('', [Validators.required]),
      individualText: fb.control('', [Validators.required]),
      businessText: fb.control('', [Validators.required]),
      businessNotificationText: fb.control('', [Validators.required]),
    });
  }

  public ngOnInit(): void {
    const sub = this.staticData.getMailTexts().subscribe((res) => {
      this.mailGroup.patchValue(res);
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public saveForm(): void {
    if (isFormInvalid(this.mailGroup)) return;
    this.mailGroup.disable();
    this.isLoading = true;
    const data = this.mailGroup.getRawValue();
    data.signature = data.signature.replaceAll('<p>', '');
    data.signature = data.signature.replaceAll('</p>', '<br/>');
    this.staticData.setMailsTexts(data).subscribe(() => {
      this.mailGroup.enable();
      this.isLoading = false;
      this.ms.add({
        severity: 'success',
        summary: 'Запрос выполнен',
        detail: 'Данные успешно обновлены',
      });
    });
  }
}
