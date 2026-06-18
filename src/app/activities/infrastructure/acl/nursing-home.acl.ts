import { Injectable } from '@angular/core';

/**
 * Anti-Corruption Layer between the Activities BC and the Nursing BC.
 *
 * Centralizes how Activities resolves the current nursing home identity,
 * following the team convention where the presentation layer stores
 * the nursingHomeId in localStorage after authentication.
 */
@Injectable({ providedIn: 'root' })
export class NursingHomeAcl {

  getCurrentNursingHomeId(): number {
    return Number(localStorage.getItem('nursingHomeId')) || 1;
  }
}
