import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';

// Entidades
import { Plan } from '../domain/model/plan.entity';
import { Subscription } from '../domain/model/subscription.entity';

// Endpoints
import { PlansApiEndpoint } from './plans-api-endpoint';
import { SubscriptionsApiEndpoint } from './subscriptions-api-endpoint';
import { AccountsApiEndpoint } from './accounts-api-endpoint';

/**
 * @purpose: Service to interact with the Payments API
 * @description: This service provides a centralized facade to access Plans, Subscriptions, and Accounts operations.
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentsApi extends BaseApi {

  private readonly _plansApiEndpoint: PlansApiEndpoint;
  private readonly _subscriptionsApiEndpoint: SubscriptionsApiEndpoint;
  private readonly _accountsApiEndpoint: AccountsApiEndpoint;

  /**
   * Initializes the Payments API service with the required HTTP client.
   * @param http - Angular HttpClient used to perform API requests.
   */
  constructor(http: HttpClient) {
    super();
    this._plansApiEndpoint = new PlansApiEndpoint(http);
    this._subscriptionsApiEndpoint = new SubscriptionsApiEndpoint(http);
    this._accountsApiEndpoint = new AccountsApiEndpoint(http);
  }

  // ==========================================
  // PLANS
  // ==========================================

  getAvailablePlans(): Observable<Plan[]> {
    return this._plansApiEndpoint.getAvailablePlans();
  }

  // ==========================================
  // SUBSCRIPTIONS
  // ==========================================

  createSubscription(userId: number, payload: { planType: string; period: string; paymentMethodId: string }): Observable<Subscription> {
    return this._subscriptionsApiEndpoint.createSubscriptionForUser(userId, payload);
  }

  getActiveSubscription(userId: number): Observable<Subscription> {
    return this._subscriptionsApiEndpoint.getActiveSubscriptionForUser(userId);
  }

  // ==========================================
  // ACCOUNTS
  // ==========================================

  // Puedes agregar los métodos de cuentas aquí a medida que los necesites
  // Ejemplo:
  // getAccountById(accountId: number): Observable<Account> {
  //   return this._accountsApiEndpoint.getById(accountId);
  // }
}
