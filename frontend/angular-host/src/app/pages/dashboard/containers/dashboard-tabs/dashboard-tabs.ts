import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
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
export class DashboardTabs implements OnInit, OnDestroy {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  public username = computed(() => getFirstName(this._authService.account()?.nome ?? ''));

  // Computed para verificar se estamos na página de transações
  public isTransactionsPage = computed(() => this._router.url.includes('transactions'));

  ngOnInit() {
    // A lógica de subscrição foi removida para uma abordagem mais declarativa.
    // O `computed` acima agora reage diretamente às mudanças de URL do roteador.
  }

  ngOnDestroy() {
    // Não há mais subscrição manual para ser destruída.
  }

  public navLinks: INav[] = [
    { name: 'Dashboard', path: '/' },
    { name: 'Transações', path: 'transactions' },
    { name: 'Orçamento', path: 'budget' },
  ];
}
