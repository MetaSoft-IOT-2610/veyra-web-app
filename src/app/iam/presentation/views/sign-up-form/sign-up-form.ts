import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../application/iam.store';
import { SignUpCommand } from '../../../domain/model/sign-up.command';
import { CreateAdministratorCommand } from '../../../domain/model/create-administrator.command';
import { Toolbar } from '../../../../shared/presentation/components/toolbar/toolbar';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Toolbar, TranslatePipe],
  templateUrl: './sign-up-form.html',
  styleUrls: ['./sign-up-form.css'],
})
export class SignUpForm {
  protected store = inject(IamStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isAdminMode = false;

  form = new FormGroup({
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6), this.passwordStrengthValidator],
    }),
    confirmPassword: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  }, { validators: this.passwordMatchValidator });

  hidePassword = true;
  hideConfirmPassword = true;

  constructor() {
    this.route.queryParams.subscribe((params) => {
      this.isAdminMode = params['role'] === 'admin';
    });
  }

  private passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasNumber = /[0-9]/.test(value);
    const hasLetter = /[a-zA-Z]/.test(value);
    return hasNumber && hasLetter ? null : { passwordStrength: true };
  }

  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isAdminMode) {
        const createAdminCommand = new CreateAdministratorCommand({
          username: this.form.value.username!,
          password: this.form.value.password!,
        });
        this.store.createAdministrator(createAdminCommand, this.router);
      } else {
        const signUpCommand = new SignUpCommand({
          username: this.form.value.username!,
          password: this.form.value.password!,
          roles: ['ROLE_USER'],
        });
        this.store.signUp(signUpCommand, this.router);
      }
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  getUsernameError(): string {
    const control = this.form.get('username');
    if (control?.hasError('required')) return 'iam.signUp.errors.usernameRequired';
    if (control?.hasError('minlength')) return 'iam.signUp.errors.usernameMinLength';
    if (control?.hasError('maxlength')) return 'iam.signUp.errors.usernameMaxLength';
    return '';
  }

  getPasswordError(): string {
    const control = this.form.get('password');
    if (control?.hasError('required')) return 'iam.signUp.errors.passwordRequired';
    if (control?.hasError('minlength')) return 'iam.signUp.errors.passwordMinLength';
    if (control?.hasError('passwordStrength')) return 'iam.signUp.errors.passwordStrength';
    return '';
  }

  getConfirmPasswordError(): string {
    const control = this.form.get('confirmPassword');
    if (control?.hasError('required')) return 'iam.signUp.errors.confirmRequired';
    if (this.form.hasError('passwordMismatch')) return 'iam.signUp.errors.passwordMismatch';
    return '';
  }

  getPasswordStrength(): number {
    const password = this.form.get('password')?.value || '';
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  }

  getPasswordStrengthLabel(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 1) return 'iam.signUp.strength.weak';
    if (strength <= 3) return 'iam.signUp.strength.medium';
    return 'iam.signUp.strength.strong';
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 1) return '#f56565';
    if (strength <= 3) return '#ed8936';
    return '#48bb78';
  }

  getTitleKey(): string {
    return this.isAdminMode ? 'iam.signUp.titleAdmin' : 'iam.signUp.titleUser';
  }

  getSubtitleKey(): string {
    return this.isAdminMode ? 'iam.signUp.subtitleAdmin' : 'iam.signUp.subtitleUser';
  }

  getSubmitButtonKey(): string {
    return this.isAdminMode ? 'iam.signUp.submitAdmin' : 'iam.signUp.submitUser';
  }

  getSubmittingKey(): string {
    return this.isAdminMode ? 'iam.signUp.creatingAdmin' : 'iam.signUp.creatingAccount';
  }
}
