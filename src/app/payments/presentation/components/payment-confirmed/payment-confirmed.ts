import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-payment-confirmed',
  standalone: true,
  imports: [TranslatePipe, MatCard, MatButton, MatIcon, MatCardContent],
  templateUrl: './payment-confirmed.html',
  styleUrl: './payment-confirmed.css'
})
export class PaymentConfirmed {
  constructor(private router: Router) {}
  goToLogin() { this.router.navigate(['/iam/sign-in']); }
}
