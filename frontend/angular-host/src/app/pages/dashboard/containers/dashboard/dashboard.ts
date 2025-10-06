import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../../../../core/services/account.service';
import { AnalysisCard } from '../../../../shared/components/analysis-card/analysis-card';
import { ChartComponent } from '../../../../shared/components/chart/chart';

@Component({
  selector: 'app-dashboard',
  imports: [AnalysisCard, ChartComponent],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  public _accountService = inject(AccountService);

  get monthLabels() {
    return this._accountService.monthLabels();
  }

  get yearlySummary() {
    return this._accountService.monthlyChartData();
  }

  get summary() {
    return this._accountService.summary();
  }

  public async ngOnInit() {
    await this._accountService.getSummary();
    await this._accountService.getYearlySummary();
  }
}
