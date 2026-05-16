import {MonitoringResidentsResource} from './monitoring-residents-response';
import {MonitoringResidents} from '../domain/model/monitoring-residents.entity';

export class MonitoringResidentsAssembler{
  toEntityFromResource(resource: MonitoringResidentsResource ):MonitoringResidents{
    return new MonitoringResidents({
      residentId: resource.residentId,
      healthId: resource.healthId,
      doctorId: resource.doctorId
    });
  }
}
