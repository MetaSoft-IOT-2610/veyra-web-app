import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {Toolbar} from '../../../../shared/presentation/components/toolbar/toolbar';

@Component({
  selector: 'app-subscription-plan-nursing',
  standalone: true,
  imports: [CommonModule, TranslatePipe, Toolbar],
  templateUrl: './subscription-plan-nursing.html',
  styleUrls: ['./subscription-plan-nursing.css']
})
export class SubscriptionPlanNursing {

  constructor(private router: Router) {}

  choosePlan(cycle: 'monthly' | 'annual') {
    this.router.navigate(['/payments/checkout', 'nursing-home', cycle]);
  }

  goBack() {
    this.router.navigate(['/payments/choose']);
  }
}
