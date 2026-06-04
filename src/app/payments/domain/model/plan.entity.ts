import {BaseEntity} from '../../../shared/domain/model/base-entity';

export class Plan implements BaseEntity{
  private _id: number;
  private _stripePlanId: string;
  private _name: string;
  private _description: string;
  private _priceMonthly: number;
  private _priceAnnual: number;
  private _discountAnnual: number;
  private _type: "family" | "nursing-home";
  private _features: string[];

  constructor(
    id: number,
    stripePlanId: string,
    name: string,
    description: string,
    priceMonthly: number,
    priceAnnual: number,
    discountAnnual: number,
    type: "family" | "nursing-home",
    features: string[]
  ) {
    this._id = id;
    this._stripePlanId = stripePlanId;
    this._name = name;
    this._description = description;
    this._priceMonthly = priceMonthly;
    this._priceAnnual = priceAnnual;
    this._discountAnnual = discountAnnual;
    this._type = type;
    this._features = features;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get stripePlanId(): string {
    return this._stripePlanId;
  }

  set stripePlanId(value: string) {
    this._stripePlanId = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get priceMonthly(): number {
    return this._priceMonthly;
  }

  set priceMonthly(value: number) {
    this._priceMonthly = value;
  }

  get priceAnnual(): number {
    return this._priceAnnual;
  }

  set priceAnnual(value: number) {
    this._priceAnnual = value;
  }

  get discountAnnual(): number {
    return this._discountAnnual;
  }

  set discountAnnual(value: number) {
    this._discountAnnual = value;
  }

  get type(): "family" | "nursing-home" {
    return this._type;
  }

  set type(value: "family" | "nursing-home") {
    this._type = value;
  }

  get features(): string[] {
    return this._features;
  }

  set features(value: string[]) {
    this._features = value;
  }
}
