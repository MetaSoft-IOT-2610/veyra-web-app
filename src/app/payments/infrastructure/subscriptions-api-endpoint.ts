import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Subscription } from '../domain/model/subscription.entity';
import { SubscriptionResource, SubscriptionsResponse } from './subscriptions-response';
import { SubscriptionAssembler } from './subscription-assembler';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubscriptionsApiEndpoint extends BaseApiEndpoint<Subscription, SubscriptionResource, SubscriptionsResponse, SubscriptionAssembler> {

  constructor(private httpClient: HttpClient) {
    super(httpClient, '', new SubscriptionAssembler());
  }

  createSubscriptionForUser(userId: number, payload: { planType: string; period: string; paymentMethodId: string }): Observable<Subscription> {
    const endpoint = environment.platformProviderUserSubscriptionsEndpointPath.replace('{userId}', userId.toString());
    const url = `${environment.platformProviderApiBaseUrl}${endpoint}`;

    return this.httpClient.post<SubscriptionResource>(url, payload).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  getActiveSubscriptionForUser(userId: number): Observable<Subscription> {
    const endpoint = environment.platformProviderUserActiveSubscriptionEndpointPath.replace('{userId}', userId.toString());
    const url = `${environment.platformProviderApiBaseUrl}${endpoint}`;

    return this.httpClient.get<SubscriptionResource>(url).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }
}
