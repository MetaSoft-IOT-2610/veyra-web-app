import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Plan } from '../domain/model/plan.entity';
import { PlanResource, PlansResponse } from './plans-response';

export class PlanAssembler implements BaseAssembler<Plan, PlanResource, PlansResponse> {
  toEntitiesFromResponse(response: PlansResponse): Plan[] {
    return response.plans.map(plan => this.toEntityFromResource(plan));
  }

  toEntityFromResource(resource: PlanResource): Plan {
    return new Plan(
      resource.id,
      resource.planId, // <-- El string de Stripe
      resource.name,
      resource.description,
      resource.priceMonthly,
      resource.priceAnnual,
      resource.discountAnnual,
      resource.type,
      resource.features
    );
  }

  toResourceFromEntity(entity: Plan): PlanResource {
    return {
      id: entity.id,
      planId: entity.stripePlanId, // <-- El string de Stripe
      name: entity.name,
      description: entity.description,
      priceMonthly: entity.priceMonthly,
      priceAnnual: entity.priceAnnual,
      discountAnnual: entity.discountAnnual,
      type: entity.type,
      features: entity.features
    } as PlanResource;
  }
}
