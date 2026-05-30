import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Subscription } from '../domain/model/subscription.entity';
import { SubscriptionResource, SubscriptionsResponse } from './subscriptions-response';

export class SubscriptionAssembler implements BaseAssembler<Subscription, SubscriptionResource, SubscriptionsResponse> {

  toEntitiesFromResponse(response: SubscriptionsResponse): Subscription[] {
    return response.subscriptions.map(subscription => this.toEntityFromResource(subscription));
  }

  /*
* @purpose: Assembler class to convert between Subscription entity and SubscriptionResource
* @description: This class implements methods to transform data from the API resource format to the domain entity format and vice versa.
* */
  toEntityFromResource(resource: SubscriptionResource): Subscription {
    return new Subscription({
      id: resource.id,
      userId: resource.userId,
      planType: resource.planType,
      period: resource.period,
      status: resource.status,
    });
  }

  /*
* @purpose: Convert Subscription entity to SubscriptionResource
* @description: This method takes a Subscription entity and maps its properties to a SubscriptionResource object suitable for API communication.
* */
  toResourceFromEntity(entity: Subscription): SubscriptionResource {
    return {
      id: entity.id,
      userId: entity.userId,
      planType: entity.planType,
      period: entity.period,
      status: entity.status
    } as SubscriptionResource;
  }
}
