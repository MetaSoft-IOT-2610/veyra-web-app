import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import {IamStore} from '../../../application/iam.store';
import {SetPasswordCommand} from '../../../domain/model/set-password.command';
import {iamNav} from '../../iam.routes';
import {Toolbar} from '../../../../shared/presentation/components/toolbar/toolbar';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
}

@Component({
  selector: 'app-set-password-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslateModule,
    Toolbar,
  ],
  templateUrl: './set-password-form.html',
  styleUrl: './set-password-form.css'
})
export class SetPasswordForm implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly store = inject(IamStore);

  private token = '';
  protected tokenMissing = false;
  protected hidePassword = true;
  protected hideConfirmPassword = true;

  protected readonly form = new FormGroup(
    {
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator }
  );

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) this.tokenMissing = true;
  }

  protected togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  protected toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  protected getPasswordError(): string {
    const ctrl = this.form.get('password');
    if (ctrl?.hasError('required')) return 'iam.SET_PASSWORD.ERRORS.PASSWORD_REQUIRED';
    if (ctrl?.hasError('minlength')) return 'iam.SET_PASSWORD.ERRORS.PASSWORD_MIN_LENGTH';
    return '';
  }

  protected getConfirmPasswordError(): string {
    const ctrl = this.form.get('confirmPassword');
    if (ctrl?.hasError('required')) return 'iam.SET_PASSWORD.ERRORS.CONFIRM_REQUIRED';
    if (this.form.hasError('passwordMismatch')) return 'iam.SET_PASSWORD.ERRORS.PASSWORD_MISMATCH';
    return '';
  }

  protected performBackToSignIn() {
    void this.router.navigate(iamNav.signIn());
  }

  protected onSubmit() {
    if (this.form.invalid || this.tokenMissing) return;
    const command = new SetPasswordCommand({
      token: this.token,
      password: this.form.value.password!
    });
    this.store.setPassword(command, this.router);
  }
}
