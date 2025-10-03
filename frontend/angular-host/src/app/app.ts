import { Component, WritableSignal, inject, signal } from '@angular/core';
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
}
