import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CreateSubscriptionDto {
  planType: string;
  period: string;
  paymentMethodId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private baseUrl = environment.platformProviderApiBaseUrl;

  constructor(private http: HttpClient) {}

  getAvailablePlans(): Observable<any[]> {
    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next([
          { id: "plan_fam_001", name: "Family Plan", type: "family" },
          { id: "plan_nur_001", name: "Nursing Home Plan", type: "nursing-home" }
        ]);
        subscriber.complete();
      }, 500);
    });
  }

  createSubscription(userId: number, payload: CreateSubscriptionDto): Observable<any> {
    const endpoint = environment.platformProviderUserSubscriptionsEndpointPath
      .replace('{userId}', userId.toString());
    return this.http.post(`${this.baseUrl}${endpoint}`, payload);
  }

  getActiveSubscription(userId: number): Observable<any> {
    const endpoint = environment.platformProviderUserActiveSubscriptionEndpointPath
      .replace('{userId}', userId.toString());
    return this.http.get(`${this.baseUrl}${endpoint}`);
  }
}
