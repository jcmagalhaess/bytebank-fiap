import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarIconComponent } from '../icons';

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
        <span class="text-sm hidden sm:inline">Joana</span>
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
                joao@email.com
              </div>
              <button class="block w-full text-left px-4 py-2 text-sm text-textPrimary hover:bg-backgroundSecondary transition-colors">
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarIconComponent]
})
export class HeaderComponent {
}
