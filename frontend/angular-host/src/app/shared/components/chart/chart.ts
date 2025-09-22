import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, ChartDataset, ChartType, registerables } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.html',
})
export class ChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  // Entradas reativas para os dados e configurações do gráfico
  public data = input.required<ChartDataset[]>();
  public labels = input.required<string[]>();
  public type = input<ChartType>('bar');
  public indexAxis = input<'x' | 'y'>('y');
  public stacked = input<boolean>(false);

  private chart: Chart | undefined;

  constructor() {
    // Registra todos os módulos do Chart.js (gráficos, escalas, etc.)
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Atualiza o gráfico se os dados de entrada mudarem
    if (this.chart && (changes['data'] || changes['labels'])) {
      this.chart.destroy();
      this.createChart();
    }
  }

  private createChart(): void {
    if (!this.chartCanvas) return;

    const config: ChartConfiguration = {
      type: this.type(),
      data: {
        labels: this.labels(),
        datasets: this.data(),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: this.indexAxis(),
        scales: {
          x: {
            beginAtZero: true,
            stacked: this.stacked(),
          },
          y: {
            stacked: this.stacked(),
          },
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20, // Adiciona um espaçamento geral na legenda
            },
          },
        },
        layout: {
          padding: { top: 10 },
        },
      },
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }
}
