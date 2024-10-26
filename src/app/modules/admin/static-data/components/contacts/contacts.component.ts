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
import { LoadingService } from '../../../../../_services/front/loading.service';
import { Contacts } from '../../../../../_models/static-data/contacts';
import { ConfirmationService, MessageService } from 'primeng/api';

type ArrayTypes = 'workTime' | 'address' | 'phones' | 'mapImages';

@Component({
  selector: 'flower-valley-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  public contactsForm: FormGroup;
  public isLoading: boolean = false;
  public newPhoto: File | undefined;
  public removedPhoto: string | undefined;

  constructor(
    private fb: FormBuilder,
    private ls: LoadingService,
    private ms: MessageService,
    private cs: ConfirmationService,
    private staticData: StaticDataService,
  ) {
    this.contactsForm = fb.group({
      workTime: fb.array([fb.control('', Validators.required)]),
      address: fb.array([fb.control('', Validators.required)]),
      whatsAppNumber: ['', Validators.required],
      phones: fb.array([fb.control('', Validators.required)]),
      mail: ['', Validators.required],
      mapImages: fb.array([fb.control('', Validators.required)]),
    });
  }

  ngOnInit(): void {
    const sub = this.staticData.getContactsContent().subscribe((data) => {
      this.patchValue(data);
      this.ls.removeSubscription(sub);
    });
    this.ls.addSubscription(sub);
  }

  public saveContacts(): void {
    // if (isFormInvalid(this.contactsForm)) return;
    if (this.newPhoto) {
      const formData = new FormData();
      formData.append('file', this.newPhoto);
      if (this.removedPhoto) {
        formData.append('removeUrl', this.removedPhoto);
      }
      this.staticData.uploadFile(formData).subscribe((res) => {
        this.addControlToArray('mapImages');
        const controlsLength = this.getControlArray('mapImages').length;
        this.getControlArray('mapImages').controls[controlsLength - 1].setValue(res);
        this.newPhoto = undefined;
        this.saveContactsRequest();
      });
    } else {
      this.saveContactsRequest();
    }
  }

  private saveContactsRequest(): void {
    this.isLoading = true;
    this.contactsForm.disable();
    const contacts = this.contactsForm.getRawValue();
    this.staticData.setContactsContent(contacts).subscribe(() => {
      this.contactsForm.enable();
      this.isLoading = false;
      this.ms.add({
        severity: 'success',
        summary: 'Запрос выполнен',
        detail: 'Данные успешно обновлены',
      });
    });
  }

  private patchValue(contacts: Contacts): void {
    for (const key in contacts) {
      // @ts-ignore
      const value = contacts[key];
      if (value instanceof Array) {
        if (value.length > 1) {
          for (let i = 1; i < value.length; i++) {
            this.addControlToArray(key as ArrayTypes);
          }
        }
      }
    }
    this.contactsForm.patchValue(contacts);
  }

  public getControlArray(control: ArrayTypes): FormArray {
    return this.contactsForm.controls[control] as FormArray;
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

  public addPhoto(photos: File[]): void {
    this.newPhoto = photos[0];
  }

  public editPhoto(photo: File[], index: number): void {
    const formData = new FormData();
    const oldImg = this.getControlArray('mapImages').controls[index].value;
    formData.append('file', photo[0]);
    formData.append('removeUrl', oldImg);
    this.staticData.uploadFile(formData).subscribe((res) => {
      this.getControlArray('mapImages').controls[index].setValue(res);
    });
  }

  public deletePhoto(index: number): void {
    this.cs.confirm({
      header: 'Подтвердите удаление фотографии',
      message: `Вы действительно хотите удалить фотографию?`,
      accept: () => {
        this.removedPhoto = this.getControlArray('mapImages').controls[index].value;
        this.getControlArray('mapImages').removeAt(index);
      },
    });
  }
}
