import { Plan } from "../domain/model/plan.entity";
import { PlanResponse } from "./plans-response";

export class PlanAssembler {
  static toEntity(data: PlanResponse): Plan {
    return new Plan(
      data.id,
      data.name,
      data.description,
      data.priceMonthly,
      data.priceAnnual,
      data.discountAnnual,
      data.type,
      data.features
    );
  }

  static toEntityList(data: PlanResponse[]): Plan[] {
    return data.map(item => this.toEntity(item));
  }
}
