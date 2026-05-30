export class Subscription {
  id: number;
  userId: number;
  planType: string;
  period: string;
  status: string;

  constructor(data: { id?: number; userId: number; planType: string; period: string; status?: string }) {
    this.id = data.id || 0;
    this.userId = data.userId;
    this.planType = data.planType;
    this.period = data.period;
    this.status = data.status || 'INCOMPLETE';
  }
}
