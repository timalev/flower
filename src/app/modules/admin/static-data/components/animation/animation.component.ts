import { Component, OnInit } from '@angular/core';
import { StaticDataService } from '../../../../../_services/back/static-data.service';
import { LoadingService } from '../../../../../_services/front/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isFormInvalid } from '../../../../../_utils/formValidCheck';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'flower-valley-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss'],
})
export class AnimationComponent implements OnInit {
  public animationForm: FormGroup;
  public isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private ls: LoadingService,
    private ms: MessageService,
    private staticData: StaticDataService,
  ) {
    this.animationForm = fb.group({
      firstNumber: [null, Validators.required],
      firstSuffix: ['', Validators.required],
      firstText: ['', Validators.required],
      secondNumber: [null, Validators.required],
      secondSuffix: ['', Validators.required],
      secondText: ['', Validators.required],
      thirdNumber: [null, Validators.required],
      thirdSuffix: ['', Validators.required],
      thirdText: ['', Validators.required],
      fourthNumber: [null, Validators.required],
      fourthSuffix: ['', Validators.required],
      fourthText: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const sub = this.staticData.getAnimations().subscribe((animation) => {
      this.animationForm.patchValue(animation);
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public saveAnimations(): void {
    if (isFormInvalid(this.animationForm)) return;
    this.animationForm.disable();
    this.isLoading = true;
    const animation = this.animationForm.getRawValue();
    this.staticData.setAnimations(animation).subscribe(() => {
      this.animationForm.enable();
      this.isLoading = false;
      this.ms.add({
        severity: 'success',
        summary: 'Запрос выполнен',
        detail: 'Данные успешно обновлены',
      });
    });
  }
}
