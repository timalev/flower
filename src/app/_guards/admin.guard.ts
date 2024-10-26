import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AdminService } from '../_services/back/admin.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private adminService: AdminService) {}

  public canActivate(): Observable<boolean> {
    return this.adminService.checkAdmin().pipe(
      tap((res) => {
        if (res) return true;
        this.router.navigate(['sign-in']);
        return false;
      }),
    );
  }
}
