import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NursingStore } from '../../../application/nursing.store';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {NgForOf, NgIf} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {CreateRelativeCommand} from '../../../domain/model/create-relative.command';
import { RelativeDetail } from '../relative-detail/relative-detail';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Relative } from '../../../domain/model/relative.entity';

@Component({
  selector: 'app-relative-list',
  standalone: true,
  imports: [
    MatError,
    MatIcon,
    MatLabel,
    MatFormField,
    TranslatePipe,
    MatInput,
    MatIconButton,
    MatProgressSpinner,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './relative-list.html',
  styleUrls: ['./relative-list.css']
})
export class RelativeList {
  readonly store = inject(NursingStore);
  protected router = inject(Router);
  nursingHomeId: number = Number(localStorage.getItem('nursingHomeId') || 0);

  ngOnInit() {
    if (this.nursingHomeId) {
      this.store.loadRelativesByNursingHomeId(this.nursingHomeId);
    }
  }

  selectedId: number | null = null;
  searchTerm = signal('');
  filteredRelativesProfilesIds = signal<number[]>([]);

  relatives = computed(() => {
    return this.store.relatives();
  });

  filteredRelatives = computed(() => {
    const ids = this.filteredRelativesProfilesIds();
    const allRelatives = this.relatives();
    const term = this.searchTerm();

    if (!term) {
      return allRelatives;
    }

    return allRelatives.filter(r => ids.includes(r.residentId));
  });

  private dialog = inject(MatDialog);

  openRelativeDetail(relative: Relative) {
    const ref = this.dialog.open(RelativeDetail, {
      data: relative,
      width: '900px',
      maxWidth: '95vw',
      panelClass: 'relative-detail-dialog'
    });

    ref.afterClosed().subscribe((result: CreateRelativeCommand | undefined) => {
      if (result) {
        this.store.updateRelative(this.nursingHomeId, relative.id, result);
      }
    });
  }

  selectRelative(id: number) {
    this.selectedId = this.selectedId === id ? null : id;
  }

  createRelative() {
    this.router.navigate(['/nursing/relatives/new']).then();
  }

  trackById(index: number, item: any) {
    return item?.id ?? index;
  }
}
