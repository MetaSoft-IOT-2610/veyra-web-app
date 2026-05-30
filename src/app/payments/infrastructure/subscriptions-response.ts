import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/*
* @purpose: Interfaces for Subscription API responses
* @description: These interfaces define the structure of the data received from the Subscription API, including individual subscription resources and the overall response format.
* */

export interface SubscriptionResource extends BaseResource {
  id: number;
  userId: number;
  planType: string;
  period: string;
  status: string;
}

/*
* @purpose: Interface for Subscription API response
* @description: This interface extends the BaseResponse to include an array of SubscriptionResource objects, representing the data returned from the API.
* */

export interface SubscriptionsResponse extends BaseResponse {
  subscriptions: SubscriptionResource[];
}
