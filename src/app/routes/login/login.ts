import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { AdminService } from '../../core/services/admin.service';
import { WhiteFindPharmaLogo } from '../../shared/Logos/white-find-pharma-logo/white-find-pharma-logo';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, WhiteFindPharmaLogo],
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly adminService = inject(AdminService);
  private readonly router = inject(Router);

  public readonly submitting = signal(false);
  public readonly errorMessage = signal('');

  public readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public control(name: string): FormControl {
    return this.form.get(name) as FormControl;
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set('');

    const { email, password } = this.form.getRawValue();
    this.adminService.login(email!, password!).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/verification']);
      },
      error: err => {
        this.submitting.set(false);
        this.errorMessage.set(err?.error?.message || 'Login failed. Please try again.');
      },
    });
  }
}
