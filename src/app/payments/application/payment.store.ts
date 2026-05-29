import { Injectable } from '@angular/core';
import { PaymentsApi } from "../infrastructure/payments-api";
import { Plan } from "../domain/model/plan.entity";
import { Account } from "../domain/model/account.entity";
import { Subscription } from "../domain/model/subscription.entity";

// Importamos los Assemblers
import { PlanAssembler } from "../infrastructure/plan-assembler";
import { AccountAssembler } from "../infrastructure/account-assembler";
import { SubscriptionAssembler } from "../infrastructure/subscription-assembler";

@Injectable({
  providedIn: 'root'
})
export class PaymentStore {
  private api = new PaymentsApi();

  plans: Plan[] = [];
  selectedPlan: Plan | null = null;
  billingCycle: "monthly" | "annual" = "monthly";

  account: Account | null = null;
  subscription: Subscription | null = null;

  isLoading = false;
  error: string | null = null;

  async loadPlans() {
    this.isLoading = true;
    this.error = null;

    try {
      const data = await this.api.getAvailablePlans();
      // Usamos el Assembler para listas
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

  async createAccount(payload: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    role: "family" | "nursing-home";
  }) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await this.api.createAccount(payload);
      // Usamos el Assembler
      this.account = AccountAssembler.toEntity(response);
    } catch (e: any) {
      this.error = e.message;
    } finally {
      this.isLoading = false;
    }
  }

  async createSubscription() {
    if (!this.account || !this.selectedPlan) {
      this.error = "No account or plan selected.";
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const response = await this.api.createSubscription({
        accountId: this.account.id,
        planId: this.selectedPlan.id,
        cycle: this.billingCycle,
      });

      // Usamos el Assembler
      this.subscription = SubscriptionAssembler.toEntity(response);
    } catch (e: any) {
      this.error = e.message;
    } finally {
      this.isLoading = false;
    }
  }
}
