import { Account } from "../domain/model/account.entity";
import { AccountResponse } from "./accounts-response";

export class AccountAssembler {
  static toEntity(data: AccountResponse): Account {
    return new Account(
      data.id,
      data.fullName,
      data.email,
      data.phone,
      data.country,
      data.role,
      data.createdAt,
      data.updatedAt
    );
  }
}
