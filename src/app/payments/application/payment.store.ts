import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Plan } from "../domain/model/plan.entity";
import { Subscription } from "../domain/model/subscription.entity";
import { PaymentsApi } from "../infrastructure/payments-api"; // Inyectamos el nuevo Facade

@Injectable({
  providedIn: 'root'
})
export class PaymentStore {

  plans: Plan[] = [];
  selectedPlan: Plan | null = null;
  billingCycle: "monthly" | "annual" = "monthly";
  subscription: Subscription | null = null;

  isLoading = false;
  error: string | null = null;

  constructor(private api: PaymentsApi) {}

  async loadPlans() {
    this.isLoading = true;
    this.error = null;
    try {
      this.plans = await firstValueFrom(this.api.getAvailablePlans());
    } catch (e: any) {
      this.error = e.message;
    } finally {
      this.isLoading = false;
    }
  }

  selectPlan(plan: Plan) {
    this.selectedPlan = plan;
  }

  setBillingCycle(cycle: "monthly" | "annual") {
    this.billingCycle = cycle;
  }

  async createSubscription(userId: number, paymentMethodId: string) {
    if (!this.selectedPlan) {
      this.error = "No plan selected.";
      return;
    }

    this.isLoading = true;
    this.error = null;

    const mappedPlanType = this.selectedPlan.type === 'family' ? 'FAMILY' : 'NURSING_HOME';
    const mappedPeriod = this.billingCycle === 'monthly' ? 'MONTHLY' : 'ANNUALLY';

    try {
      // Retorna directamente la entidad Subscription gracias al Assembler
      this.subscription = await firstValueFrom(
        this.api.createSubscription(userId, {
          planType: mappedPlanType,
          period: mappedPeriod,
          paymentMethodId: paymentMethodId
        })
      );
    } catch (e: any) {
      this.error = e.error?.message || "Error procesando el pago con Stripe.";
    } finally {
      this.isLoading = false;
    }
  }
}
