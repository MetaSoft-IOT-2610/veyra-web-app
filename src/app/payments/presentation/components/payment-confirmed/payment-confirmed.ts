import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-confirmed',
  standalone: true,
  imports: [TranslatePipe],
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
