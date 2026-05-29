import { AccountResponse } from "./accounts-response";
import { PlanResponse } from "./plans-response";
import { SubscriptionResponse } from "./subscriptions-response";

// JSON Server levanta en el puerto 3000 por defecto
const BASE_URL = "http://localhost:3000";

export class PaymentsApi {

  async getAvailablePlans(): Promise<PlanResponse[]> {
    const response = await fetch(`${BASE_URL}/plans`);
    if (!response.ok) throw new Error("Failed to fetch plans");
    return response.json();
  }

  async createAccount(payload: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    role: string;
  }): Promise<AccountResponse> {
    // JSON server generará automáticamente el 'id' al hacer POST
    const response = await fetch(`${BASE_URL}/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }),
    });

    if (!response.ok) throw new Error("Failed to create account");
    return response.json();
  }

  async createSubscription(payload: {
    accountId: string;
    planId: string;
    cycle: "monthly" | "annual";
  }): Promise<SubscriptionResponse> {

    // Obtenemos el precio mockeado para guardarlo en la "BD"
    const mockPrice = payload.cycle === "monthly" ? 30 : 300;

    const response = await fetch(`${BASE_URL}/subscriptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscriptionId: "sub_" + Math.random().toString(36).substr(2, 9),
        accountId: payload.accountId,
        planId: payload.planId,
        cycle: payload.cycle,
        price: mockPrice,
        status: "active",
        createdAt: new Date().toISOString()
      }),
    });

    if (!response.ok) throw new Error("Failed to create subscription");
    return response.json();
  }
}
