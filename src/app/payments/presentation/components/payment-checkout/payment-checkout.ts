import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentStore } from '../../../application/payment.store';
import { TranslatePipe } from '@ngx-translate/core';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'payment-checkout',
  templateUrl: './payment-checkout.html',
  styleUrls: ['./payment-checkout.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule, NgIf, CurrencyPipe, TranslatePipe, TitleCasePipe,
    MatCardModule,
    MatFormField, MatLabel, MatInput, MatError, MatButton, MatIcon, MatProgressSpinner
  ]
})
export class PaymentCheckoutPage implements OnInit {

  planPrice: number = 0;
  planTitle: string = 'Selected Plan';
  period: 'monthly' | 'annual' = 'monthly';
  stripeForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public store: PaymentStore
  ) {
    this.stripeForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expMonth: ['', Validators.required],
      expYear: ['', Validators.required],
      cvc: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(p => {
      const type = p['type'];
      this.period = p['cycle'] === 'annual' ? 'annual' : 'monthly';
      this.planTitle = type === 'family' ? 'Family Plan' : 'Nursing Home Plan';
      this.planPrice = this.getPrice(this.planTitle, this.period);
      this.store.setBillingCycle(this.period);
      this.store.selectedPlan = { id: type === 'family' ? 'plan_fam_001' : 'plan_nur_001' } as any;
    });
  }

  getPrice(plan: string, period: string): number {
    if (plan === 'Family Plan') return period === 'monthly' ? 30 : 300;
    if (plan === 'Nursing Home Plan') return period === 'monthly' ? 300 : 3000;
    return 0;
  }

  cancel() { this.router.navigate(['/payments/choose']); }

  async submitPayment() {
    if (this.stripeForm.invalid) {
      this.stripeForm.markAllAsTouched();
      this.error = 'Please fill out all required fields correctly.';
      return;
    }
    this.error = null;
    try {
      await this.store.createSubscription(1, 'pm_card_visa');
      if (this.store.error) {
        this.error = this.store.error;
        return;
      }
      void this.router.navigate(['/payments/confirmed']);
    } catch (e) {
      void this.router.navigate(['/payments/cancelled']);
    }
  }
}
