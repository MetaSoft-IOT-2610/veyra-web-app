import { Subscription } from "../domain/model/subscription.entity";
import { SubscriptionResponse } from "./subscriptions-response";

export class SubscriptionAssembler {
  static toEntity(data: SubscriptionResponse): Subscription {
    return new Subscription(
      data.subscriptionId,
      data.accountId,
      data.planId,
      data.cycle,
      data.price,
      data.status,
      data.createdAt
    );
  }
}
