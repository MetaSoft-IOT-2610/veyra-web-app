import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { paymentsNav } from '../../payments-routes';

@Component({
  selector: 'app-payment-cancelled',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './payment-cancelled.html',
  styleUrl: './payment-cancelled.css',
})
export class PaymentCancelled {
  private readonly router = inject(Router);

  goBack(): void {
    void this.router.navigate(paymentsNav.choose());
  }
}
