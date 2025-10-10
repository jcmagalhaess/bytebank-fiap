import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { INav } from '../../../../shared/interfaces/nav.interface';
import { getFirstName } from '../../../../shared/utils/format';

@Component({
  selector: 'app-dashboard-tabs',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-tabs.html',
  styleUrl: './dashboard-tabs.scss',
})
export class DashboardTabs {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  public username = computed(() => getFirstName(this._authService.account()?.nome ?? ''));

  public isTransactionsPage = computed(() => this._router.url.includes('transactions'));

  public navLinks: INav[] = [
    { name: 'Dashboard', path: '/' },
    { name: 'Transações', path: 'transactions' },
    // { name: 'Orçamento', path: 'budget' },
  ];
}
