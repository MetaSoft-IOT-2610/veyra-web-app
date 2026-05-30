import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Account } from '../domain/model/account.entity';
import { AccountResource, AccountsResponse } from './accounts-response';
import { AccountAssembler } from './account-assembler';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountsApiEndpoint extends BaseApiEndpoint<Account, AccountResource, AccountsResponse, AccountAssembler> {
  constructor(http: HttpClient) {
    const url = `${environment.platformProviderApiBaseUrl}/payments/accounts`;
    super(http, url, new AccountAssembler());
  }
}
