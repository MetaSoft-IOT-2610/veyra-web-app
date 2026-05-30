import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Plan } from '../domain/model/plan.entity';
import { PlanResource, PlansResponse } from './plans-response';
import { PlanAssembler } from './plan-assembler';

@Injectable({ providedIn: 'root' })
export class PlansApiEndpoint extends BaseApiEndpoint<Plan, PlanResource, PlansResponse, PlanAssembler> {

  constructor(http: HttpClient) {
      // Si tuvieras endpoint real: super(http, `${environment.platformProviderApiBaseUrl}/plans`, new PlanAssembler());
    super(http, '', new PlanAssembler());
  }

  getAvailablePlans(): Observable<Plan[]> {
    const mockResources: PlanResource[] = [
      { id: 1, planId: "plan_fam_001", name: "Family Plan", type: "family", description: "", priceMonthly: 0, priceAnnual: 0, discountAnnual: 0, features: [] },
      { id: 2, planId: "plan_nur_001", name: "Nursing Home Plan", type: "nursing-home", description: "", priceMonthly: 0, priceAnnual: 0, discountAnnual: 0, features: [] }
    ];

    return of(mockResources.map(resource => this.assembler.toEntityFromResource(resource)));
  }
}
