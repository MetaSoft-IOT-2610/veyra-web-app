export class SetPasswordCommand {
  private _token:string;
  private _password:string;
  constructor(resource:{ token: string, password: string}) {this._token=resource.token;this._password=resource.password;}
  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }
}
