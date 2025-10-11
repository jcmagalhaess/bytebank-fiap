import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
  private readonly _activatedRoute = inject(ActivatedRoute);

  public username = computed(() => getFirstName(this._authService.account()?.nome ?? ''));

  public isTransactionsPage = signal(false);

  constructor() {
    // Atualiza o signal quando a rota muda
    this._router.events.subscribe(() => {
      const url = this._router.url;
      const isTransactions = url.includes('/transactions');
      this.isTransactionsPage.set(isTransactions);
    });

    // Define o estado inicial
    const url = this._router.url;
    this.isTransactionsPage.set(url.includes('/transactions'));
  }

  public navLinks: INav[] = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Transações', path: 'transactions' },
    // { name: 'Orçamento', path: 'budget' },
  ];

  public isRouteActive(path: string): boolean {
    const currentUrl = this._router.url;

    if (path === '/dashboard') {
      return currentUrl === '/dashboard' || currentUrl === '/dashboard/';
    }

    return currentUrl.includes(path);
  }
}
