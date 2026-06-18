import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';

import { HealthStore } from '../../../application/health.store';

@Component({
  selector: 'app-resident-vital-signs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resident-vital-signs.html',
  styleUrl: './resident-vital-signs.css'
})
export class ResidentVitalSigns implements OnChanges {
  @Input() residentId = 0;

  readonly store = inject(HealthStore);

  readonly threshold = this.store.threshold;
  readonly isLoading = this.store.loading;
  readonly errorMessage = this.store.error;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['residentId'] && this.residentId > 0) {
      this.store.loadThresholdByResident(this.residentId);
    }
  }
}
