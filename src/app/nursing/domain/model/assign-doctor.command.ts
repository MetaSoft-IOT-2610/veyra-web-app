export class AssignDoctorCommand {

  private _doctorId:number;
  private _residentId:number;
  constructor(assignDoctorCommand: { doctorId: number, residentId: number }) {
    this._doctorId = assignDoctorCommand.doctorId;
    this._residentId = assignDoctorCommand.residentId;
  }

  get doctorId(): number {
    return this._doctorId;
  }

  set doctorId(value: number) {
    this._doctorId = value;
  }

  get residentId(): number {
    return this._residentId;
  }

  set residentId(value: number) {
    this._residentId = value;
  }
}

