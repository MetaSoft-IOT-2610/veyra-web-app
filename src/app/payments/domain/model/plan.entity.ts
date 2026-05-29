import { PlanResponse } from "../../infrastructure/plans-response";

export class Plan {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public priceMonthly: number,
    public priceAnnual: number,
    public discountAnnual: number,
    public type: "family" | "nursing-home",
    public features: string[]
  ) {}
}
