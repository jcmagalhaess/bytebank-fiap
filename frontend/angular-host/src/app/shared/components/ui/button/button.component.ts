import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'warning' | 'info' | 'action';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() class: string = '';
  @Output() click = new EventEmitter<Event>();

  get buttonClasses(): string {
    const base = 'px-5 py-2 rounded-lg font-semibold transition-all duration-200 font-inter text-sm leading-5';

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

    const variantClasses = this.disabled ? disabledStyles[this.variant] : variants[this.variant];

    return `${base} ${variantClasses} ${this.class}`.trim();
  }

  onButtonClick(event: Event): void {
    if (!this.disabled) {
      this.click.emit(event);
    }
  }
}
