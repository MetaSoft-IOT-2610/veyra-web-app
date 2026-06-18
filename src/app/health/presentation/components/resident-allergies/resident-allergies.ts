import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Allergy } from '../../../domain/model/allergy.entity';
import { AllergiesApiService } from '../../../infrastructure/allergies-api.service';

@Component({
  selector: 'app-resident-allergies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resident-allergies.html',
  styleUrl: './resident-allergies.css'
})
export class ResidentAllergies implements OnChanges {
  @Input() residentId = 0;

  allergies: Allergy[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private allergiesApiService: AllergiesApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['residentId'] && this.residentId > 0) {
      this.loadAllergies();
    }
  }

  private loadAllergies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.allergiesApiService.getAllergiesByResidentId(this.residentId).subscribe({
      next: (allergies) => {
        this.allergies = allergies;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load allergies.';
        this.isLoading = false;
      }
    });
  }
}
