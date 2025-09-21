import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { INav } from '../../../../shared/interfaces/nav.interface';

@Component({
  selector: 'app-dashboard-tabs',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-tabs.html',
  styleUrl: './dashboard-tabs.scss',
})
export class DashboardTabs {
  public navLinks: INav[] = [
    { name: 'Dashboard', path: '/' },
    { name: 'Transações', path: '/transactions' },
    { name: 'Orçamento', path: '/budget' },
  ];
}
