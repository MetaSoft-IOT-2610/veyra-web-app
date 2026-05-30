export class MonitoringResidents  {
  get healthId(): number {
    return this._healthId;
  }

  set healthId(value: number) {
    this._healthId = value;
  }
  private _residentId:number;
  private _doctorId:number;
  private _healthId:number;
  constructor(monitoringResidentsEntity:{residentId:number; doctorId:number; healthId:number}) {
    this._residentId = monitoringResidentsEntity.residentId;
    this._doctorId = monitoringResidentsEntity.doctorId;
    this._healthId = monitoringResidentsEntity.healthId;
  }

  get residentId(): number {
    return this._residentId;
  }

  set residentId(value: number) {
    this._residentId = value;
  }

  get doctorId(): number {
    return this._doctorId;
  }

  set doctorId(value: number) {
    this._doctorId = value;
  }
}
