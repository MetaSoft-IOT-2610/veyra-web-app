import { MetricResource } from './metrics-response';
import { Metric } from '../domain/model/metric.entity';

const ALL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export class MetricAssembler {
  toEntityFromResource(resource: MetricResource): Metric {
    return new Metric({
      labels: ALL_MONTHS,
      values: this.normalizeToFullYear(resource.labels, resource.values),
      metricType: resource.metricType,
      total: resource.total
    });
  }

  private normalizeToFullYear(labels: string[], values: number[]): number[] {
    const result = Array(12).fill(0);
    labels.forEach((month, index) => {
      const monthIndex = ALL_MONTHS.indexOf(month);
      if (monthIndex !== -1) {
        result[monthIndex] = values[index];
      }
    });
    return result;
  }
}
