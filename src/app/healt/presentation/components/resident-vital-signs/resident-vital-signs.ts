import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { VitalSign } from '../../../domain/model/vital-sign.entity';
import { VitalSignsApiService } from '../../../infrastructure/vital-signs-api.service';

@Component({
  selector: 'app-resident-vital-signs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resident-vital-signs.html',
  styleUrl: './resident-vital-signs.css'
})
export class ResidentVitalSigns implements OnChanges {
  @Input() residentId = 0;

  vitalSigns: VitalSign[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private vitalSignsApiService: VitalSignsApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['residentId'] && this.residentId > 0) {
      this.loadVitalSigns();
    }
  }

  private loadVitalSigns(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.vitalSignsApiService.getVitalSignsByResidentId(this.residentId).subscribe({
      next: (vitalSigns) => {
        this.vitalSigns = vitalSigns;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load vital signs.';
        this.isLoading = false;
      }
    });
  }
}
