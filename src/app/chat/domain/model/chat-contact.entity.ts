import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class ChatContact implements BaseEntity {
  private _id: number;
  private _username: string;
  private _roles: string[];

  constructor(data: { id: number; username: string; roles: string[] }) {
    this._id = data.id;
    this._username = data.username;
    this._roles = data.roles;
  }

  get id(): number { return this._id; }
  get username(): string { return this._username; }
  get roles(): string[] { return this._roles; }
}
