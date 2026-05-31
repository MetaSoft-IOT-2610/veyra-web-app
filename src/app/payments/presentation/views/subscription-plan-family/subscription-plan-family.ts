import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { paymentsNav } from '../../payments-routes';

@Component({
  selector: 'app-subscription-plan-family',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-plan-family.html',
  styleUrls: ['./subscription-plan-family.css']
})
export class SubscriptionPlanFamily {

  constructor(private router: Router) {}

  choosePlan(cycle: 'monthly' | 'annual') {
    void this.router.navigate(paymentsNav.checkout('family', cycle));
  }

  goBack() {
    void this.router.navigate(paymentsNav.choose());
  }
}
