export class Relative {
  private _id: number;
  private _firstName: string;
  private _lastName: string;
  private _email : string;
  private _residentId: number;
  private _nursingHomeId: number;

  constructor(relative: { id: number, firstName: string,lastName:string, email: string, residentId: number, nursingHomeId?: number }) {
    this._id = relative.id;
    this._firstName = relative.firstName;
    this._lastName = relative.lastName;
    this._email = relative.email;
    this._residentId = relative.residentId;
    this._nursingHomeId = relative.nursingHomeId ?? 0;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get firstName(): string {
    return this._firstName;
  }
  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }
  set lastName(value: string) {
    this._lastName = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get residentId(): number {
    return this._residentId;
  }
  set residentId(value: number) {
    this._residentId = value;
  }

  get nursingHomeId(): number {
    return this._nursingHomeId;
  }

  set nursingHomeId(value: number) {
    this._nursingHomeId = value;
  }

}
