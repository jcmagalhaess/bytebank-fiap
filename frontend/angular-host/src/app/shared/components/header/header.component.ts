import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarIconComponent } from '../icons';
import { AuthService } from '../../../core/services/auth.service';
import { getFirstName } from '../../utils/format';

@Component({
  selector: 'app-header',
  template: `
    <header class="w-full h-[80px] bg-brandSecondary text-backgroundPrimary px-lg py-sm flex items-center justify-between font-inter">
      <!-- Logo -->
      <a routerLink="/" class="cursor-pointer">
        <img
          src="logo_bytebank.png"
          alt="Bytebank Logo"
          class="h-8 w-auto cursor-pointer"
        />
      </a>

      <!-- Nome do usuário e avatar -->
      <div class="flex items-center gap-xs">
        @if (authService.isAuthenticated() && authService.user()) {
          <span class="text-sm hidden sm:inline">{{ getFirstName(authService.user()!.username) }}</span>
          <div class="relative group">
            <div class="w-9 h-9 bg-transparent rounded-full flex items-center justify-center cursor-pointer">
              <app-avatar-icon
                class="text-backgroundPrimary text-[26px]"
              ></app-avatar-icon>
            </div>
            <!-- Dropdown menu -->
            <div class="absolute right-0 mt-2 w-48 bg-backgroundPrimary rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div class="py-1">
                <div class="px-4 py-2 text-sm text-textSecondary border-b border-backgroundSecondary">
                  {{ authService.user()!.email }}
                </div>
                <button
                  (click)="handleLogout()"
                  class="block w-full text-left px-4 py-2 text-sm text-textPrimary hover:bg-backgroundSecondary transition-colors">
                  Sair
                </button>
              </div>
            </div>
          </div>
            } @else {
              <!-- Botão de Login Simples -->
              <button
                (click)="handleLogin()"
                [disabled]="authService.isLoading()"
                class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
                @if (authService.isLoading()) {
                  Entrando...
                } @else {
                  Entrar
                }
              </button>
            }
      </div>
    </header>
  `,
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
