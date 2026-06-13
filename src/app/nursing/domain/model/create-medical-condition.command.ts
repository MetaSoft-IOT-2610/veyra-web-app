export class CreateMedicalConditionCommand {
  diagnosisName: string;
  diagnosisDate: string;
  status: string;
  notes: string;

  constructor(command: {
    diagnosisName: string;
    diagnosisDate: string;
    status: string;
    notes: string;
  }) {
    this.diagnosisName = command.diagnosisName;
    this.diagnosisDate = command.diagnosisDate;
    this.status = command.status;
    this.notes = command.notes;
  }
}
