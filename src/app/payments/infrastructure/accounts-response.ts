import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface AccountResource extends BaseResource {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  role: "family" | "nursing-home";
  createdAt: string;
  updatedAt: string;
}

export interface AccountsResponse extends BaseResponse {
  accounts: AccountResource[];
}
