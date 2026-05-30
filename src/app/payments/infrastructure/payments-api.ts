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
export class PaymentsApi {

  private baseUrl = environment.platformProviderApiBaseUrl;

  constructor(private http: HttpClient) {}

  // Mantenemos los planes estáticos temporalmente ya que no hay endpoint GET /plans
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

  /**
   * Llama a POST /api/v1/users/{userId}/subscriptions
   */
  createSubscription(userId: number, payload: CreateSubscriptionDto): Observable<any> {
    // Reemplazamos {userId} por el ID real
    const endpoint = environment.platformProviderUserSubscriptionsEndpointPath
      .replace('{userId}', userId.toString());

    return this.http.post(`${this.baseUrl}${endpoint}`, payload);
  }

  /**
   * Llama a GET /api/v1/users/{userId}/subscriptions/active
   * (Muy útil para cuando el usuario inicie sesión y quieras ver si ya pagó)
   */
  getActiveSubscription(userId: number): Observable<any> {
    const endpoint = environment.platformProviderUserActiveSubscriptionEndpointPath
      .replace('{userId}', userId.toString());

    return this.http.get(`${this.baseUrl}${endpoint}`);
  }
}
