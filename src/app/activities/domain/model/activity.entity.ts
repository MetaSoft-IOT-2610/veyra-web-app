export type ActivityType = 'MEAL' | 'BATH' | 'RISK_PROFILE';
export type ActivityStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export class Activity {
  private _id: number;
  private _residentId: number;
  private _healthcareStaffId: number;
  private _type: ActivityType;
  private _status: ActivityStatus;
  private _notes: string;
  private _loggedAt: string;

  constructor(activity: {
    id: number;
    residentId: number;
    healthcareStaffId: number;
    type: ActivityType;
    status: ActivityStatus;
    notes: string;
    loggedAt: string;
  }) {
    this._id = activity.id;
    this._residentId = activity.residentId;
    this._healthcareStaffId = activity.healthcareStaffId;
    this._type = activity.type;
    this._status = activity.status;
    this._notes = activity.notes;
    this._loggedAt = activity.loggedAt;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get residentId(): number { return this._residentId; }
  set residentId(value: number) { this._residentId = value; }

  get healthcareStaffId(): number { return this._healthcareStaffId; }
  set healthcareStaffId(value: number) { this._healthcareStaffId = value; }

  get type(): ActivityType { return this._type; }
  set type(value: ActivityType) { this._type = value; }

  get status(): ActivityStatus { return this._status; }
  set status(value: ActivityStatus) { this._status = value; }

  get notes(): string { return this._notes; }
  set notes(value: string) { this._notes = value; }

  get loggedAt(): string { return this._loggedAt; }
  set loggedAt(value: string) { this._loggedAt = value; }

  log(): Activity {
    this._status = 'IN_PROGRESS';
    this._loggedAt = new Date().toISOString();
    return this;
  }

  complete(): Activity {
    this._status = 'COMPLETED';
    return this;
  }
}
