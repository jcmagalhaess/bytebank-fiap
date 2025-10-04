import { Component, HostListener, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
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

  @HostListener('window:loginRequest', ['$event'])
  async onLoginRequest(event: Event) {
    try {
      await this.authService.login((event as CustomEvent).detail);
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

  @HostListener('window:registrationRequest', ['$event'])
  async onRegistrationRequest(event: Event) {
    try {
      await this.authService.register((event as CustomEvent).detail);
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
  async ngOnInit() {
    await this.authService.checkAuth();
  }
}
