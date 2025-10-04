import { Component, HostListener, WritableSignal, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  ArrowDownIconComponent,
  ArrowRightIconComponent,
  ArrowUpIconComponent,
  AvatarIconComponent,
  EditIconComponent,
  GearIconComponent,
  SearchIconComponent,
  SettingIconComponent,
  TrashIconComponent,
  UploadIconComponent,
} from './shared/components/icons';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    ArrowDownIconComponent,
    ArrowRightIconComponent,
    ArrowUpIconComponent,
    AvatarIconComponent,
    EditIconComponent,
    GearIconComponent,
    SearchIconComponent,
    SettingIconComponent,
    TrashIconComponent,
    UploadIconComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('angular-host');
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  readonly showHeader: WritableSignal<boolean> = signal(false);

  constructor() {
    // Ouve os eventos de navegação do roteador
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Esconde o header se a URL começar com /auth
        this.showHeader.set(!event.urlAfterRedirects.startsWith('/auth'));
      });
  }

  // Escuta o evento de login vindo do remote
  @HostListener('window:loginRequest', ['$event'])
  async onLoginRequest(event: Event) {
    try {
      // Acessamos a propriedade 'detail' do evento customizado
      await this.authService.login((event as CustomEvent).detail);
      // Em caso de sucesso, o host redireciona
      this.router.navigate(['/dashboard']); // Redireciona para o dashboard
    } catch (error: any) {
      // Em caso de falha, o host envia um evento de resposta com o erro
      const responseEvent = new CustomEvent('loginResponse', {
        detail: {
          success: false,
          error: error.message,
        },
      });
      window.dispatchEvent(responseEvent);
    }
  }

  // Escuta o evento de cadastro vindo do remote
  @HostListener('window:registrationRequest', ['$event'])
  async onRegistrationRequest(event: Event) {
    try {
      // Acessamos a propriedade 'detail' do evento customizado
      await this.authService.register((event as CustomEvent).detail);
      // Em caso de sucesso, o host redireciona para o login para que o usuário possa entrar
      this.router.navigate(['/auth/login'], { queryParams: { registered: 'success' } });
    } catch (error: any) {
      // Em caso de falha, o host envia um evento de resposta com o erro
      const responseEvent = new CustomEvent('registrationResponse', {
        detail: {
          success: false,
          error: error.message,
        },
      });
      window.dispatchEvent(responseEvent);
    }
  }
}
