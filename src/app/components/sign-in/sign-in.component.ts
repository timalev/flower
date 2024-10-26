import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../_services/back/admin.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { Password } from 'primeng/password';

@Component({
  selector: 'flower-valley-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements AfterViewInit {
  @ViewChild('password') private password: Password | undefined;
  public passwordForm: FormGroup;
  public isAdmin: boolean = false;
  public isError = false;
  public isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private ms: MessageService,
    private cdr: ChangeDetectorRef,
  ) {
    this.passwordForm = fb.group({
      password: ['', Validators.required],
    });
    this.passwordForm.controls['password'].valueChanges.subscribe(() => {
      if (this.isError) this.isError = false;
    });
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      if (this.password) {
        this.password.input.nativeElement.focus();
        this.cdr.detectChanges();
      }
    }, 0);
  }

  public signIn(): void {
    if (this.passwordForm.invalid) {
      this.ms.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Пароль не заполнен',
      });
      this.isError = true;
      return;
    }
    const password = this.passwordForm.getRawValue();
    this.isLoading = true;
    this.adminService
      .signIn(password)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(
        () => {
          this.router.navigate(['admin']);
        },
        ({ error }) => {
          this.ms.add({
            severity: 'error',
            summary: 'Неверный пароль',
            detail: error.message,
          });
          this.isError = true;
        },
      );
  }
}
