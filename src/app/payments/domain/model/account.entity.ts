import { AccountResponse } from "../../infrastructure/accounts-response";

export class Account {
  constructor(
    public id: string,
    public fullName: string,
    public email: string,
    public phone: string,
    public country: string,
    public role: "family" | "nursing-home",
    public createdAt: string,
    public updatedAt: string
  ) {}
}
