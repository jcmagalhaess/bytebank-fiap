import { CurrencyPipe, NgClass, PercentPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-analysis-card',
  templateUrl: './analysis-card.html',
  styleUrl: './analysis-card.scss',
  imports: [CurrencyPipe, NgClass, PercentPipe],
})
export class AnalysisCard {
  public label = input.required<string>();
  public type = input<'income' | 'expense' | 'balance' | null>(null);
  public price = input<number>(0);
  public alignment = input<'horizontal' | 'vertical'>('vertical');
  public isHorizontal = computed(() => this.alignment() === 'horizontal');
  public isVertical = computed(() => this.alignment() === 'vertical');
  public evolution = input<number>(0);
  public isPositive = computed(() => this.evolution() > 0);
  public isNegative = computed(() => this.evolution() < 0);

  protected readonly color = computed(() => {
    switch (this.type()) {
      case 'income':
        return 'bg-feedbackSuccess/10';
      case 'expense':
        return 'bg-feedbackDanger/10';
      case 'balance':
        return 'bg-feedbackInfo/10';
      default:
        return null;
    }
  });

  protected readonly urlImage = computed(() => {
    switch (this.type()) {
      case 'income':
        return 'assets/img/money-recive.png';
      case 'expense':
        return 'assets/img/money-send.png';
      case 'balance':
        return 'assets/img/receipt-text.png';
      default:
        return null;
    }
  });
}
