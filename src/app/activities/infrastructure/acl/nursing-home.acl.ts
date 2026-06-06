import { Injectable } from '@angular/core';
import { NursingStore } from '../../../nursing/application/nursing.store';

/**
 * Anti-Corruption Layer between the Activities BC and the Nursing BC.
 *
 * Activities only needs to know the ID of the current nursing home.
 * This service translates that concept from the Nursing BC's model
 * so that Activities never depends directly on Nursing internals or localStorage.
 */
@Injectable({ providedIn: 'root' })
export class NursingHomeAcl {

  constructor(private readonly nursingStore: NursingStore) {}

  getCurrentNursingHomeId(): number {
    const homes = this.nursingStore.nursingHomes();
    if (homes.length > 0) return homes[0].id;
    return parseInt(localStorage.getItem('nursingHomeId') ?? '1');
  }
}
