import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { getFirstName } from '../../utils/format';
import { AvatarIconComponent } from '../icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarIconComponent],
})
export class HeaderComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) {}

  async ngOnInit() {
    // A verificação inicial agora é feita apenas no app.ts
  }

  getFirstName = getFirstName;

  handleLogin(): void {
    // A função do botão "Entrar" no header é apenas navegar para a página de login.
    this.router.navigate(['/auth/login']);
  }

  handleLogout() {
    this.authService.logout();
  }
}
