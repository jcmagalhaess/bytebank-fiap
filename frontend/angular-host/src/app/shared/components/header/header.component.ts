import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarIconComponent } from '../icons';
import { AuthService } from '../../../core/services/auth.service';
import { getFirstName } from '../../utils/format';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarIconComponent]
})
export class HeaderComponent implements OnInit {
  constructor(public authService: AuthService) {}

  async ngOnInit() {
    // Verifica se o usuário está autenticado ao carregar o componente
    await this.authService.checkAuth();
  }

  getFirstName = getFirstName;

  async handleLogin() {
    try {
      // Usa prompt nativo do navegador para capturar email e senha
      const email = prompt('Digite seu email:');
      if (!email) return; // Usuário cancelou

      const password = prompt('Digite sua senha:');
      if (!password) return; // Usuário cancelou

      await this.authService.login({
        email: email,
        password: password
      });

    } catch (error) {
      console.error('Erro no login:', error);
      // O erro já é mostrado no template através do authService.error()
    }
  }

  handleLogout() {
    this.authService.logout();
  }
}
