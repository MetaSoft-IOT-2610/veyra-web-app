export class Allergy {
  id: number;
  residentId: number;
  allergen: string;
  reaction: string;
  severity: string;
  diagnosedAt: string;
  notes: string;

  constructor() {
    this.id = 0;
    this.residentId = 0;
    this.allergen = '';
    this.reaction = '';
    this.severity = '';
    this.diagnosedAt = '';
    this.notes = '';
  }
}
