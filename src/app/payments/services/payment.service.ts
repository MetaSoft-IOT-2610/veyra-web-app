import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:8080/api/v1'; // Ajusta el puerto si es necesario

export interface CreateSubscriptionDto {
  planType: string;
  period: string;
  paymentMethodId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsApi {

  constructor(private http: HttpClient) {}

  // Nota: Como tu backend no tiene un endpoint GET /plans, los mantendremos estáticos
  // o puedes crear un endpoint en el futuro.
  getAvailablePlans(): Observable<any[]> {
    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next([
          { id: "plan_fam", name: "Family Plan", type: "family" },
          { id: "plan_nur", name: "Nursing Home Plan", type: "nursing-home" }
        ]);
        subscriber.complete();
      }, 500);
    });
  }

  // Llamada REAL a tu UserSubscriptionsController
  createSubscription(userId: number, payload: CreateSubscriptionDto): Observable<any> {
    return this.http.post(`${BASE_URL}/users/${userId}/subscriptions`, payload);
  }
}
