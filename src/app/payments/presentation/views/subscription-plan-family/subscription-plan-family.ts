import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {Toolbar} from '../../../../shared/presentation/components/toolbar/toolbar';

@Component({
  selector: 'app-subscription-plan-family',
  standalone: true,
  imports: [CommonModule, TranslatePipe, Toolbar],
  templateUrl: './subscription-plan-family.html',
  styleUrls: ['./subscription-plan-family.css']
})
export class SubscriptionPlanFamily {

  constructor(private router: Router) {}

  choosePlan(cycle: 'monthly' | 'annual') {
    this.router.navigate(['/payments/checkout', 'family', cycle]);
  }

  goBack() {
    this.router.navigate(['/payments/choose']);
  }
}
