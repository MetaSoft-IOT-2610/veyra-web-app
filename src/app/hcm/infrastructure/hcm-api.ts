import { Injectable } from '@angular/core';
import { StaffApiEndpoint } from './staff-api-endpoint';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { HttpClient } from '@angular/common/http';
import { StaffMember } from '../domain/model/staff-member.entity';
import { Observable } from 'rxjs';
import { ContractsApiEndpoint } from './contracts-api-endpoint';
import { Contract } from '../domain/model/contract.entity';
import { CreateStaffMemberCommandsApiEndpoint } from './create-staff-member-commands-api-endpoint';
import {CreateStaffMemberCommand} from '../domain/model/create-staff-member.command';
import {CreateContractCommandsApiEndpoint} from './create-contract-commands-api-endpoint';
import {CreateContractCommand} from '../domain/model/create-contract.command';
import {UpdateContractStatusCommandsApiEndpoint} from './update-contract-status.commands-api-endpoint';
import {UpdateContractStatusCommand} from '../domain/model/update-contract-status.command';
import { StaffNursingHomeApiEndpoint, StaffNursingHomeResource } from './staff-nursing-home-api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class HcmApi extends BaseApi {
  private readonly _staffApiEndpoint: StaffApiEndpoint;
  private readonly _contractsApiEndpoint: ContractsApiEndpoint;
  private readonly _staffMemberCommandsApiEndpoint: CreateStaffMemberCommandsApiEndpoint;
  private readonly _contractCommandsApiEndpoint: CreateContractCommandsApiEndpoint;
  private readonly _updateContractStatusCommandsApiEndpoint: UpdateContractStatusCommandsApiEndpoint;
  private readonly _staffNursingHomeApiEndpoint: StaffNursingHomeApiEndpoint;

  constructor(http:HttpClient) {
    super();
    this._staffApiEndpoint = new StaffApiEndpoint(http);
    this._contractsApiEndpoint = new ContractsApiEndpoint(http);
    this._staffMemberCommandsApiEndpoint = new CreateStaffMemberCommandsApiEndpoint(http);
    this._contractCommandsApiEndpoint = new CreateContractCommandsApiEndpoint(http);
    this._updateContractStatusCommandsApiEndpoint = new UpdateContractStatusCommandsApiEndpoint(http);
    this._staffNursingHomeApiEndpoint = new StaffNursingHomeApiEndpoint(http);
  }

  createStaffMember(nursingHomeId: number, staffMemberCommand: CreateStaffMemberCommand): Observable<StaffMember> {
    return this._staffMemberCommandsApiEndpoint.create(nursingHomeId, staffMemberCommand);
  }

  deleteStaffMember(id: number): Observable<void> {
    return this._staffApiEndpoint.delete(id);
  }

  updateStaffMember(staffMemberId: number, staffMemberCommand: CreateStaffMemberCommand): Observable<StaffMember> {
    return this._staffMemberCommandsApiEndpoint.update(staffMemberId, staffMemberCommand);
  }

  getStaffMembers(nursingHomeId: number) {
    return this._staffMemberCommandsApiEndpoint.getAll(nursingHomeId);
  }

  createContract(staffMemberId: number, contractCommand: CreateContractCommand): Observable<Contract> {
    return this._contractCommandsApiEndpoint.create(staffMemberId, contractCommand);
  }

  getContracts(staffMemberId: number): Observable<Contract[]> {
    return this._contractCommandsApiEndpoint.getAll(staffMemberId);
  }

  updateContractStatus(staffMemberId: number, contractId: number, updateContractStatusCommand: UpdateContractStatusCommand): Observable<Contract> {
    return this._updateContractStatusCommandsApiEndpoint.updateContractStatus(staffMemberId, contractId, updateContractStatusCommand);
  }

  /** GET /api/v1/staff/by-user/{userId}/nursing-homes */
  getNursingHomeByUserId(userId: number): Observable<StaffNursingHomeResource> {
    return this._staffNursingHomeApiEndpoint.getNursingHomeByUserId(userId);
  }
}
