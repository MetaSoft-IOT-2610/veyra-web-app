import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';

import { Plan } from '../domain/model/plan.entity';
import { Subscription } from '../domain/model/subscription.entity';

import { PlansApiEndpoint } from './plans-api-endpoint';
import { SubscriptionsApiEndpoint } from './subscriptions-api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class PaymentsApi extends BaseApi {

  private readonly _plansApiEndpoint: PlansApiEndpoint;
  private readonly _subscriptionsApiEndpoint: SubscriptionsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this._plansApiEndpoint = new PlansApiEndpoint(http);
    this._subscriptionsApiEndpoint = new SubscriptionsApiEndpoint(http);
  }

  getAvailablePlans(): Observable<Plan[]> {
    return this._plansApiEndpoint.getAvailablePlans();
  }

  createSubscription(userId: number, payload: { planType: string; period: string; paymentMethodId: string }): Observable<Subscription> {
    return this._subscriptionsApiEndpoint.createSubscriptionForUser(userId, payload);
  }

  getActiveSubscription(userId: number): Observable<Subscription> {
    return this._subscriptionsApiEndpoint.getActiveSubscriptionForUser(userId);
  }
}
