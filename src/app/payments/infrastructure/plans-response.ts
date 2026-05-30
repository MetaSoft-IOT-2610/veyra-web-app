import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface PlanResource extends BaseResource {
  id: number;
  planId: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  discountAnnual: number;
  type: "family" | "nursing-home";
  features: string[];
}

export interface PlansResponse extends BaseResponse {
  plans: PlanResource[];
}
