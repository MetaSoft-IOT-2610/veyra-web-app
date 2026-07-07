import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { iamNav } from '../../iam.routes';
import { IamStore } from '../../../application/iam.store';
import { Toolbar } from '../../../../shared/presentation/components/toolbar/toolbar';
import { SignInCommand } from '../../../domain/model/sign-in.command';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, Toolbar, TranslatePipe],
  templateUrl: './sign-in-form.html',
  styleUrls: ['./sign-in-form.css'],
})
export class SignInForm {
  protected store = inject(IamStore);
  private router = inject(Router);

  form = new FormGroup({
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });
  hidePassword = true;

  onSubmit(): void {
    if (!this.form.valid) {
      this.markFormGroupTouched(this.form);
      return;
    }
    const signInCommand = new SignInCommand({
      username: this.form.value.username!,
      password: this.form.value.password!,
    });
    this.store.signIn(signInCommand, this.router);
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  getUsernameError(): string {
    const control = this.form.get('username');
    if (control?.hasError('required')) {
      return 'iam.signIn.errors.usernameRequired';
    }
    if (control?.hasError('minlength')) {
      return 'iam.signIn.errors.usernameMinLength';
    }
    return '';
  }

  getPasswordError(): string {
    const control = this.form.get('password');
    if (control?.hasError('required')) {
      return 'iam.signIn.errors.passwordRequired';
    }
    if (control?.hasError('minlength')) {
      return 'iam.signIn.errors.passwordMinLength';
    }
    return '';
  }

  performSignUpUser(): void {
    void this.router.navigate(iamNav.signUp(), { queryParams: { role: 'user' } });
  }

  performSignUpAdmin(): void {
    void this.router.navigate(iamNav.signUp(), { queryParams: { role: 'admin' } });
  }
}
