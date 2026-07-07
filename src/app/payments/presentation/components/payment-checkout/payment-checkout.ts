import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { paymentsNav } from '../../payments-routes';

@Component({
  selector: 'payment-checkout',
  templateUrl: './payment-checkout.html',
  styleUrls: ['./payment-checkout.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, TranslatePipe],
})
export class PaymentCheckoutPage {
  planPrice = 0;
  planTitleKey = 'payments.checkout.planGeneric';
  periodKey = 'payments.checkout.monthly';

  stripeForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  private readonly translate = inject(TranslateService);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.stripeForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expMonth: ['', Validators.required],
      expYear: ['', Validators.required],
      cvc: ['', Validators.required],
    });

    this.route.params.subscribe((p) => {
      const type = p['type'];
      this.periodKey = p['cycle'] === 'annual' ? 'payments.checkout.annual' : 'payments.checkout.monthly';

      if (type === 'family') {
        this.planTitleKey = 'payments.checkout.planFamily';
        this.planPrice = p['cycle'] === 'annual' ? 300 : 30;
      } else if (type === 'nursing-home') {
        this.planTitleKey = 'payments.checkout.planNursing';
        this.planPrice = p['cycle'] === 'annual' ? 3000 : 300;
      } else {
        this.planTitleKey = 'payments.checkout.planGeneric';
        this.planPrice = 0;
      }
    });
  }

  cancel() {
    void this.router.navigate(paymentsNav.choose());
  }

  submitPayment() {
    if (this.stripeForm.invalid) {
      this.error = 'payments.checkout.validationError';
      return;
    }

    this.error = null;
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      void this.router.navigate(['/payments/confirmed']);
    }, 1500);
  }
}
