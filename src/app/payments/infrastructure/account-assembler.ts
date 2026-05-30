import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Account } from '../domain/model/account.entity';
import { AccountResource, AccountsResponse } from './accounts-response';

export class AccountAssembler implements BaseAssembler<Account, AccountResource, AccountsResponse> {
  toEntitiesFromResponse(response: AccountsResponse): Account[] {
    return response.accounts.map(account => this.toEntityFromResource(account));
  }

  toEntityFromResource(resource: AccountResource): Account {
    return new Account(
      resource.id.toString(), // Adaptando el number del BaseResource a string temporalmente
      resource.fullName,
      resource.email,
      resource.phone,
      resource.country,
      resource.role,
      resource.createdAt,
      resource.updatedAt
    );
  }

  toResourceFromEntity(entity: Account): AccountResource {
    return {
      id: Number(entity.id),
      fullName: entity.fullName,
      email: entity.email,
      phone: entity.phone,
      country: entity.country,
      role: entity.role,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    } as AccountResource;
  }
}
