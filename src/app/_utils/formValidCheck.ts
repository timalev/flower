import { FormArray, FormControl, FormGroup } from '@angular/forms';

export function markInvalidFields(form: FormGroup | FormControl) {
  if (!form) {
    return;
  }
  if (form instanceof FormControl) {
    form.markAsDirty();
  } else {
    Object.keys(form.controls).map((control) => {
      const element = form.get(control);
      if (element?.invalid) {
        if (element instanceof FormArray) {
          element.controls.map((arrayControl) => {
            if (arrayControl instanceof FormControl) {
              markInvalidFields(arrayControl as FormControl);
            } else {
              markInvalidFields(arrayControl as FormGroup);
            }
          });
        }
        if (element instanceof FormGroup) {
          markInvalidFields(element);
        }
        element?.markAsDirty();
      }
    });
  }
}

export function isFormInvalid(form: FormGroup | FormControl): boolean {
  if (form?.invalid) {
    markInvalidFields(form);
    return true;
  }
  return false;
}
