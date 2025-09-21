import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
  public username = computed(() => getFirstName(this._authService.user()?.username!) || '');
  public navLinks: INav[] = [
    { name: 'Dashboard', path: '/' },
    { name: 'Transações', path: '/transactions' },
    { name: 'Orçamento', path: '/budget' },
  ];

  async ngOnInit() {
    // Verifica se o usuário está autenticado ao carregar o componente
    await this._authService.checkAuth();
  }
}
