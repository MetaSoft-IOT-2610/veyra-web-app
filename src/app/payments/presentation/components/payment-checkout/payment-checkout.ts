import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { paymentsNav } from '../../payments-routes';

@Component({
  selector: 'payment-checkout',
  templateUrl: './payment-checkout.html',
  styleUrls: ['./payment-checkout.css'], // <-- ¡Aquí está la línea agregada para enlazar tu CSS!
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    CurrencyPipe
  ]
})
export class PaymentCheckoutPage {
  /** Values passed from route */
  planPrice: number = 0;
  planTitle: string = 'Selected Plan';
  period: string = 'monthly';

  stripeForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router // <-- Inyectamos el Router aquí
  ) {

    // Build form
    this.stripeForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // <-- Validación de email añadida
      phone: ['', Validators.required],
      cardNumber: ['', Validators.required],
      expMonth: ['', Validators.required],
      expYear: ['', Validators.required],
      cvc: ['', Validators.required]
    });

    // Get URL params dynamically
    this.route.params.subscribe(p => {
      const type = p['type'];
      this.period = p['cycle'] || 'monthly'; // Valor por defecto

      // Plan title
      this.planTitle =
        type === 'family'
          ? 'Family Plan'
          : type === 'nursing-home'
            ? 'Nursing Home Plan'
            : 'Subscription';

      this.planPrice = this.getPrice(this.planTitle, this.period);
    });
  }

  /** Pricing logic */
  getPrice(plan: string, period: string): number {
    if (plan === 'Family Plan') {
      return period === 'monthly' ? 30 : 300;
    }
    if (plan === 'Nursing Home Plan') {
      return period === 'monthly' ? 300 : 3000;
    }
    return 0;
  }

  /** Cancel button */
  cancel() {
    // Usar el Router en lugar de history.back() es mejor práctica en Angular (SPA)
    void this.router.navigate(paymentsNav.choose());
  }

  /** Simulate payment */
  submitPayment() {
    if (this.stripeForm.invalid) {
      this.error = 'Please fill out all required fields correctly.';
      return;
    }

    this.error = null;
    this.isLoading = true;

    // Simula un pequeño retraso de red (1.5s) y luego navega a confirmación
    setTimeout(() => {
      this.isLoading = false;
      void this.router.navigate(['/payments/confirmed']);
    }, 1500);
  }
}
