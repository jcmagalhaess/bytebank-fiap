import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
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
  private subscription?: Subscription;

  public username = computed(() => getFirstName(this._authService.user()?.nome ?? ''));

  // Signal para controlar o estado da página atual
  private currentUrl = signal(this._router.url);

  // Computed para verificar se estamos na página de transações
  public isTransactionsPage = computed(() => {
    const url = this.currentUrl();
    console.log('Current URL:', url); // Debug
    return url.includes('transactions');
  });

  ngOnInit() {
    // Escutar mudanças na rota
    this.subscription = this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log('Navigation event:', event.url); // Debug
        this.currentUrl.set(event.url);
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public navLinks: INav[] = [
    { name: 'Dashboard', path: '' },
    { name: 'Transações', path: 'transactions' },
    { name: 'Orçamento', path: 'budget' },
  ];
}
