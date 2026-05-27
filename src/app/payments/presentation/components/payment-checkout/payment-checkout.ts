import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'payment-checkout',
  templateUrl: './payment-checkout.html',
  styleUrls: ['./payment-checkout.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    CurrencyPipe
  ]
})
export class PaymentCheckoutPage {
  planPrice: number = 0;
  planTitle: string = 'Selected Plan';
  period: string = 'monthly';

  stripeForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService // <-- 1. Inyectamos tu PaymentService
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

    this.route.params.subscribe(p => {
      const type = p['type'];
      this.period = p['cycle'] || 'monthly';

      this.planTitle =
        type === 'family'
          ? 'Family Plan'
          : type === 'nursing-home'
            ? 'Nursing Home Plan'
            : 'Subscription';

      this.planPrice = this.getPrice(this.planTitle, this.period);
    });
  }

  getPrice(plan: string, period: string): number {
    if (plan === 'Family Plan') {
      return period === 'monthly' ? 30 : 300;
    }
    if (plan === 'Nursing Home Plan') {
      return period === 'monthly' ? 300 : 3000;
    }
    return 0;
  }

  cancel() {
    this.router.navigate(['/payments/choose']);
  }

  submitPayment() {
    if (this.stripeForm.invalid) {
      this.error = 'Please fill out all required fields correctly.';
      return;
    }

    this.error = null;
    this.isLoading = true;

    // 2. Preparamos el Data Transfer Object (DTO) que espera tu PaymentService
    // Nota: En un entorno real, no envías la tarjeta al backend.
    // Stripe.js genera un 'token' seguro en el frontend que es lo que envías aquí.
    const paymentDto = {
      token: 'tok_visa', // Placeholder: Aquí iría el token generado por Stripe Elements
      amount: this.planPrice,
      currency: 'USD',
      description: `Suscripción Veyra: ${this.planTitle} (${this.period})`
    };

    this.paymentService.pagar(paymentDto).subscribe({
      next: (response) => {
        this.isLoading = false;

        console.log('Pago procesado correctamente:', response);

        // Aquí podrías llamar a this.paymentStore.createSubscription() si lo integras después

        this.router.navigate(['/payments/confirmed']);
      },
      error: (err) => {
        this.isLoading = false;

        console.error('Error al procesar el pago:', err);

        this.router.navigate(['/payments/cancelled']);
      }
    });
  }
}
