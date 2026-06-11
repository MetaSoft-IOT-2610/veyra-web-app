import {Component, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-unassign-device-dialog',
  imports: [
    MatDialogActions,
    TranslatePipe,
    MatIcon,
    MatDialogContent,
    MatDialogTitle,
    MatButton
  ],
  templateUrl: './unassign-device-dialog.html',
  styleUrl: './unassign-device-dialog.css',
})
export class UnassignDeviceDialog {
  readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UnassignDeviceDialog>);

  confirm(): void { this.dialogRef.close(true); }
  cancel(): void  { this.dialogRef.close(false); }
}
