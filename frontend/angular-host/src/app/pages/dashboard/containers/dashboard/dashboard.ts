import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../../../../core/services/account.service';
import { AnalysisCard } from '../../../../shared/components/analysis-card/analysis-card';

@Component({
  selector: 'app-dashboard',
  imports: [AnalysisCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private _accountService = inject(AccountService);

  get userCredits() {
    return this._accountService.userCredits();
  }

  get userDebits() {
    return this._accountService.userDebits();
  }

  get userBalance() {
    return this._accountService.userBalance();
  }

  public async ngOnInit() {
    await this._accountService.getAccountData();
  }
}
