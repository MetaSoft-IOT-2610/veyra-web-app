import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type ActivityType = 'MEAL' | 'BATH' | 'RISK_PROFILE';
export type ActivityStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

/**
 * Activity entity representing a daily care activity recorded by healthcare staff.
 * Acts as the Aggregate Root for the Activities bounded context.
 */
export class Activity implements BaseEntity {
  private _id: number;
  private _residentId: number;
  private _healthcareStaffId: number;
  private _type: ActivityType;
  private _status: ActivityStatus;

  constructor(activity: {
    id: number;
    residentId: number;
    healthcareStaffId: number;
    type: ActivityType;
    status: ActivityStatus;
  }) {
    this._id = activity.id;
    this._residentId = activity.residentId;
    this._healthcareStaffId = activity.healthcareStaffId;
    this._type = activity.type;
    this._status = activity.status;
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

  log(): Activity {
    this._status = 'IN_PROGRESS';
    return this;
  }

  /**
   * Completes the activity setting status to COMPLETED.
   * @returns The updated Activity entity.
   */
  complete(): Activity {
    this._status = 'COMPLETED';
    return this;
  }
}
