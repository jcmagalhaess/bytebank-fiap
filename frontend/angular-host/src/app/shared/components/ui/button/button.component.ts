import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'action';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: true,
  imports: [CommonModule, MatProgressSpinner],
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  class = input<string>('');
  loading = input<boolean>(false);
  // Quando fornecido, substitui completamente as classes calculadas
  overrideClass = input<string | null>(null);
  @Output() click = new EventEmitter<Event>();
  // Evento alternativo para evitar conflitos com (click) nativo
  @Output() pressed = new EventEmitter<void>();

  get buttonClasses(): string {
    const base =
      'px-5 py-2 rounded-lg font-semibold transition-all duration-200 font-inter text-sm leading-5';

    const variants = {
      primary: 'bg-brandPrimary text-backgroundPrimary hover:bg-brandPrimaryHover w-full',
      secondary: 'bg-brandSecondary text-backgroundPrimary hover:bg-brandSecondaryHover',
      tertiary: 'bg-brandTertiary text-textPrimary hover:bg-brandTertiaryHover',
      success: 'bg-feedbackSuccess text-backgroundPrimary',
      warning: 'bg-feedbackWarning text-backgroundPrimary',
      danger: 'bg-feedbackDanger text-backgroundPrimary',
      info: 'bg-feedbackInfo text-backgroundPrimary',
      action: 'bg-feedbackAction text-backgroundPrimary',
    };

    const disabledStyles = {
      primary: 'bg-gray-200 text-gray-500 cursor-not-allowed',
      secondary: 'bg-gray-200 text-gray-500 cursor-not-allowed',
      tertiary: 'bg-backgroundSecondary text-gray-400 cursor-not-allowed',
      success: 'bg-gray-200 text-gray-500 cursor-not-allowed',
      warning: 'bg-gray-200 text-gray-500 cursor-not-allowed',
      danger: 'bg-gray-200 text-gray-500 cursor-not-allowed',
      info: 'bg-gray-200 text-gray-500 cursor-not-allowed',
      action: 'bg-gray-200 text-gray-500 cursor-not-allowed',
    };

    // Se overrideClass for fornecido, usar somente ela
    if (this.overrideClass()) {
      return this.overrideClass()?.trim() || '';
    }

    const variantClasses = this.disabled() || this.loading()
      ? disabledStyles[this.variant()]
      : variants[this.variant()];
    return `${base} ${variantClasses} ${this.class()}`.trim();
  }

  onButtonClick(event: Event): void {
    console.log('🔘 Button clicked!', event);
    if (!this.disabled() || !this.loading()) {
      console.log('🔘 Emitting click event');
      this.click.emit(event);
      this.pressed.emit();
    } else {
      console.log('🔘 Button is disabled');
    }
  }
}
