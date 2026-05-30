import { Injectable } from '@angular/core';
import { PaymentsApi } from "../infrastructure/payments-api";
import { firstValueFrom } from 'rxjs';
import { Plan } from "../domain/model/plan.entity";
import { Subscription } from "../domain/model/subscription.entity";
import { PlanAssembler } from "../infrastructure/plan-assembler";
import { SubscriptionAssembler } from "../infrastructure/subscription-assembler";

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

  // Inyectamos la API actualizada
  constructor(private api: PaymentsApi) {}

  async loadPlans() {
    this.isLoading = true;
    this.error = null;
    try {
      const data = await firstValueFrom(this.api.getAvailablePlans());
      this.plans = PlanAssembler.toEntityList(data);
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

  // Ahora recibe el ID del usuario logueado y el token de la tarjeta
  async createSubscription(userId: number, paymentMethodId: string) {
    if (!this.selectedPlan) {
      this.error = "No plan selected.";
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Mapeamos a los ENUMS exactos de tu backend en Java
    const mappedPlanType = this.selectedPlan.type === 'family' ? 'FAMILY' : 'NURSING_HOME';
    const mappedPeriod = this.billingCycle === 'monthly' ? 'MONTHLY' : 'ANNUALLY';

    try {
      const response = await firstValueFrom(this.api.createSubscription(userId, {
        planType: mappedPlanType,
        period: mappedPeriod,
        paymentMethodId: paymentMethodId
      }));

      // Si el Assembler requiere ajustes, asegúrate de que coincida con SubscriptionResource
      this.subscription = SubscriptionAssembler.toEntity(response);
    } catch (e: any) {
      // Capturamos errores HTTP del backend (Ej: 400 DuplicateActiveSubscription)
      this.error = e.error?.message || "Error procesando el pago con Stripe.";
    } finally {
      this.isLoading = false;
    }
  }
}
