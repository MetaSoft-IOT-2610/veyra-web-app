import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {Toolbar} from '../../../../shared/presentation/components/toolbar/toolbar';

@Component({
  selector: 'app-subscription-choose',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, Toolbar],
  templateUrl: './subscription-choose.html',
  styleUrls: ['./subscription-choose.css']
})
export class SubscriptionChoosePage {

  isAnnual = false;

  constructor(private router: Router) {}

  goToFamilyPlan() {
    this.router.navigate(['/payments/plans/family']);
  }

  goToNursingPlan() {
    this.router.navigate(['/payments/plans/nursing-home']);
  }
}
