import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Subscription } from '../domain/model/subscription.entity';
import { SubscriptionResource, SubscriptionsResponse } from './subscriptions-response';
import { SubscriptionAssembler } from './subscription-assembler';
import { environment } from '../../../environments/environment';

const subscriptionsBaseUrl = `${environment.platformProviderApiBaseUrl}/subscriptions`;

/*
* @purpose: Class to handle API interactions for Subscriptions
* @description: This class extends the BaseApiEndpoint to provide specific implementations for creating, updating, and retrieving subscription data from the designated API endpoint.
* */
export class SubscriptionsApiEndpoint extends BaseApiEndpoint<Subscription, SubscriptionResource, SubscriptionsResponse, SubscriptionAssembler> {

  constructor(private httpClient: HttpClient) {
    // Inicializamos la clase base con una ruta genérica y el ensamblador
    super(httpClient, subscriptionsBaseUrl, new SubscriptionAssembler());
  }

  // --- MÉTODOS ESPECÍFICOS DEL CONTEXTO DE PAGOS ---

  /*
  * @purpose: Create a new subscription for a specific user
  * @description: Calls the custom user-subscription path overriding standard BaseApiEndpoint create behavior.
  * */
  createSubscriptionForUser(userId: number, payload: { planType: string; period: string; paymentMethodId: string }): Observable<Subscription> {
    const endpoint = environment.platformProviderUserSubscriptionsEndpointPath.replace('{userId}', userId.toString());
    const url = `${environment.platformProviderApiBaseUrl}${endpoint}`;

    return this.httpClient.post<SubscriptionResource>(url, payload).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  /*
  * @purpose: Get the active subscription for a specific user
  * */
  getActiveSubscriptionForUser(userId: number): Observable<Subscription> {
    const endpoint = environment.platformProviderUserActiveSubscriptionEndpointPath.replace('{userId}', userId.toString());
    const url = `${environment.platformProviderApiBaseUrl}${endpoint}`;

    return this.httpClient.get<SubscriptionResource>(url).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }
}
