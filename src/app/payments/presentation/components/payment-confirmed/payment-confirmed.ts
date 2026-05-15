import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-confirmed',
  standalone: true,
  imports: [],
  templateUrl: './payment-confirmed.html',
  styleUrl: './payment-confirmed.css'
})
export class PaymentConfirmed {

  constructor(private router: Router) {}

  goToLogin() {
    // Redirige al login del IAM
    this.router.navigate(['/iam/sign-in']);
  }
}
