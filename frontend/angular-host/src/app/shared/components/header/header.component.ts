import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { AuthService } from '../../../core/services/auth.service';
import { getFirstName } from '../../utils/format';
import { AvatarIconComponent } from '../icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarIconComponent],
})
export class HeaderComponent {
  public _accountService = inject(AccountService);
  public authService = inject(AuthService);
  private _router = inject(Router);

  getFirstName = getFirstName;

  handleLogin(): void {
    // A função do botão "Entrar" no header é apenas navegar para a página de login.
    this._router.navigate(['/auth/login']);
  }

  handleLogout() {
    this.authService.logout();
  }
}
