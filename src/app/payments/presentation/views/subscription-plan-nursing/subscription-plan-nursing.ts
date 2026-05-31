import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { paymentsNav } from '../../payments-routes';

@Component({
  selector: 'app-subscription-plan-nursing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-plan-nursing.html',
  styleUrls: ['./subscription-plan-nursing.css']
})
export class SubscriptionPlanNursing {

  constructor(private router: Router) {}

  choosePlan(cycle: 'monthly' | 'annual') {
    void this.router.navigate(paymentsNav.checkout('nursing-home', cycle));
  }

  goBack() {
    void this.router.navigate(paymentsNav.choose());
  }
}
