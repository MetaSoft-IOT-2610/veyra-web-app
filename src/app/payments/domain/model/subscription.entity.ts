export class Subscription {
  private _id: number;
  private _userId: number;
  private _planType: string;
  private _period: string;
  private _status: string;

  constructor(data: { id?: number; userId: number; planType: string; period: string; status?: string }) {
    this._id = data.id || 0;
    this._userId = data.userId;
    this._planType = data.planType;
    this._period = data.period;
    this._status = data.status || 'INCOMPLETE';
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }

  get planType(): string {
    return this._planType;
  }

  set planType(value: string) {
    this._planType = value;
  }

  get period(): string {
    return this._period;
  }

  set period(value: string) {
    this._period = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }
}
