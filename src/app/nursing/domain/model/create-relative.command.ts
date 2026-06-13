export class CreateRelativeCommand {
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _residentId: number;

  constructor(createRelativeCommand: { firstName: string; lastName: string; email: string; residentId: number }) {
    this._firstName = createRelativeCommand.firstName;
    this._lastName = createRelativeCommand.lastName;
    this._email = createRelativeCommand.email;
    this._residentId = createRelativeCommand.residentId;
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

  get residentId(): number | undefined {
    return this._residentId;
  }

  set residentId(value: number) {
    this._residentId = value;
  }

}
