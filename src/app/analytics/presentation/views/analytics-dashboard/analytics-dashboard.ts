import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { AnalyticsStore } from '../../../application/analytics.store';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIconButton } from '@angular/material/button';

interface ExpandedChart {
  title: string;
  data: ChartConfiguration['data'];
  options: ChartConfiguration['options'];
  type: ChartType;
}

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [
    TranslatePipe,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatDivider,
    BaseChartDirective,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule,
    MatIcon,
    MatProgressSpinner,
    MatIconButton
  ],
  templateUrl: './analytics-dashboard.html',
  styleUrl: './analytics-dashboard.css'
})
export class AnalyticsDashboard implements OnInit, OnDestroy {
  protected store = inject(AnalyticsStore);
  private readonly translate = inject(TranslateService);
  private langChangeSub?: { unsubscribe(): void };

  selectedYear = new Date().getFullYear();
  nursingHomeId: number = Number(localStorage.getItem('nursingHomeId'));

  availableYears = [2025, 2026];

  expandedChart: ExpandedChart | null = null;

  constructor() {
    this.store.getStaffTerminations(this.nursingHomeId, this.selectedYear);
    this.store.getStaffHires(this.nursingHomeId, this.selectedYear);
    this.store.getResidentsAdmissions(this.nursingHomeId, this.selectedYear);
  }

  ngOnInit(): void {
    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      this.expandedChart = null;
    });
  }

  ngOnDestroy(): void {
    this.langChangeSub?.unsubscribe();
  }

  onYearChange() {
    this.store.resetMetrics();
    this.store.getStaffTerminations(this.nursingHomeId, this.selectedYear);
    this.store.getStaffHires(this.nursingHomeId, this.selectedYear);
    this.store.getResidentsAdmissions(this.nursingHomeId, this.selectedYear);
  }

  get staffTerminationsMetric() {
    return this.store.staffTerminations();
  }

  get staffHiresMetric() {
    return this.store.staffHires();
  }

  get residentsAdmissionsMetric() {
    return this.store.residentsAdmissions();
  }

  get residentsActiveMetric() {
    return this.store.residentsActive();
  }

  get loading() {
    return this.store.loading();
  }

  get error() {
    return this.store.error();
  }

  private getMonthlyTerminations(): number[] {
    return this.staffTerminationsMetric?.values || Array(12).fill(0);
  }

  private getMonthlyHires(): number[] {
    return this.staffHiresMetric?.values || Array(12).fill(0);
  }

  private getMonthlyAdmissions(): number[] {
    return this.residentsAdmissionsMetric?.values || Array(12).fill(0);
  }

  private getMonthLabels(): string[] {
    const fromApi = this.staffTerminationsMetric?.labels;
    if (fromApi?.length) {
      return fromApi;
    }
    return this.translate.instant('analytics.charts.months') as string[];
  }

  private chartTitle(key: string): string {
    return this.translate.instant(key);
  }

  public lineTerminationsType: ChartType = 'line';
  public get lineTerminationsData(): ChartConfiguration<'line'>['data'] {
    const labels = this.getMonthLabels();
    const data = this.getMonthlyTerminations();
    return {
      labels,
      datasets: [
        {
          label: this.chartTitle('analytics.charts.terminations'),
          data,
          fill: false,
          borderColor: '#ef5350',
          backgroundColor: '#ef5350',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  }

  public get lineTerminationsOptions(): ChartConfiguration['options'] {
    return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: this.chartTitle('analytics.charts.terminationsTitle'), font: { size: 16 } }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } }
    }
  };
  }

  public barComparisonType: ChartType = 'bar';
  public get barComparisonData(): ChartConfiguration<'bar'>['data'] {
    const labels = this.getMonthLabels();
    return {
      labels,
      datasets: [
        {
          label: this.chartTitle('analytics.charts.hires'),
          data: this.getMonthlyHires(),
          backgroundColor: '#66bb6a',
          borderColor: '#66bb6a',
          borderWidth: 1
        },
        {
          label: this.chartTitle('analytics.charts.terminations'),
          data: this.getMonthlyTerminations(),
          backgroundColor: '#ef5350',
          borderColor: '#ef5350',
          borderWidth: 1
        }
      ]
    };
  }

  public get barComparisonOptions(): ChartConfiguration['options'] {
    return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true, position: 'bottom' },
      title: { display: true, text: this.chartTitle('analytics.charts.hiresVsTerminations'), font: { size: 16 } }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 2 } }
    }
  };
  }

  public lineAdmissionsType: ChartType = 'line';
  public get lineAdmissionsData(): ChartConfiguration<'line'>['data'] {
    const labels = this.getMonthLabels();
    const data = this.getMonthlyAdmissions();
    return {
      labels,
      datasets: [
        {
          label: this.chartTitle('analytics.charts.admissions'),
          data,
          fill: true,
          borderColor: '#70b1e6',
          backgroundColor: 'rgba(112, 177, 230, 0.2)',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  }

  public get lineAdmissionsOptions(): ChartConfiguration['options'] {
    return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: this.chartTitle('analytics.charts.admissionsTitle'), font: { size: 16 } }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 5 } }
    }
  };
  }

  public barAdmissionsType: ChartType = 'bar';
  public get barAdmissionsData(): ChartConfiguration<'bar'>['data'] {
    const labels = this.getMonthLabels();
    return {
      labels,
      datasets: [
        {
          label: this.chartTitle('analytics.charts.admissions'),
          data: this.getMonthlyAdmissions(),
          backgroundColor: '#66B3AD',
          borderColor: '#66B3AD',
          borderWidth: 1
        }
      ]
    };
  }

  public get barAdmissionsOptions(): ChartConfiguration['options'] {
    return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: this.chartTitle('analytics.charts.monthlyAdmissions'), font: { size: 16 } }
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 5 } }
    }
  };
  }

  get totalTerminations(): number {
    return this.staffTerminationsMetric?.total || 0;
  }

  get totalHires(): number {
    return this.staffHiresMetric?.total || 0;
  }

  get totalAdmissions(): number {
    return this.residentsAdmissionsMetric?.total || 0;
  }

  get netStaffChange(): number {
    return this.totalHires - this.totalTerminations;
  }

  get activeResidents(): number {
    return this.residentsActiveMetric?.total || 0;
  }

  expandChart(title: string, data: ChartConfiguration['data'], options: ChartConfiguration['options'], type: ChartType) {
    this.expandedChart = { title, data, options, type };
  }

  closeExpandedChart() {
    this.expandedChart = null;
  }
}
