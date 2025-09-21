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
    this.authService.loginWithCredentials({
      email: 'teste@gmail.com',
      password: 'testes',
    });
    // Apenas navega para a sua página de login customizada.
    // A lógica de chamar `loginWithCredentials` ficará dentro do componente de login.
    // this.router.navigate(['/login']);
  }

  handleLogout() {
    this.authService.logout();
  }
}
