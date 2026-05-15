import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-subscription-choose',
  templateUrl: './subscription-choose.html',
  styleUrls: ['./subscription-choose.css']
})
export class SubscriptionChoosePage {
  isAnnual: boolean = false;

  constructor(private router: Router) {}

  togglePeriod() {
    this.isAnnual = !this.isAnnual;
  }

  goToPlan(type: 'family' | 'nursing-home') {
    const cycle = this.isAnnual ? 'annual' : 'monthly';
    this.router.navigate(['/payments/plans', type === 'family' ? 'family' : 'nursing-home']);
  }
}
