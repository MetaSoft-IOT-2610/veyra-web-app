import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';

import { HealthStore } from '../../../application/health.store';

@Component({
  selector: 'app-resident-allergies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resident-allergies.html',
  styleUrl: './resident-allergies.css'
})
export class ResidentAllergies implements OnChanges {
  @Input() residentId = 0;

  readonly store = inject(HealthStore);

  readonly allergies = this.store.allergies;
  readonly isLoading = this.store.loading;
  readonly errorMessage = this.store.error;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['residentId'] && this.residentId > 0) {
      this.store.loadAllergiesByResident(this.residentId);
    }
  }
}
