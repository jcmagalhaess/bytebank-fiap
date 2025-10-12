import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  standalone: true,
  styles: [
    `
      .label--required::after {
        content: '*';
        margin-left: 0.25rem;
        color: #ff0000;
      }
    `,
  ],
  imports: [CommonModule, NgxMaskDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() error?: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() maxlength?: number;
  @Input() class: string = '';
  @Input() value: string = '';
  @Input() inputMode: 'numeric' | 'text' = 'text';

  @Output() valueChange = new EventEmitter<string>();
  @Output() input = new EventEmitter<Event>();
  @Output() blur = new EventEmitter<Event>();
  @Output() focus = new EventEmitter<Event>();

  // ControlValueAccessor implementation
  private onChange = (value: string) => {};
  private onTouched = () => {};

  get inputClasses(): string {
    const baseClasses =
      'px-sm py-3 border rounded-xl font-inter text-sm md:text-base text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2';

    const errorClasses = this.error
      ? 'border-feedbackDanger ring-feedbackDanger'
      : 'border-backgroundSecondary ring-brandPrimary';

    const disabledClasses = this.disabled ? 'bg-backgroundSecondary cursor-not-allowed' : '';

    return `${baseClasses} ${errorClasses} ${disabledClasses} ${this.class}`.trim();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    let rawValue = target.value.replace(/\D/g, ''); // Remove tudo que não é número

    if (this.inputMode === 'numeric' && rawValue) {
      // Converte para formato monetário brasileiro
      // Se digitar 1211, vira 12,11
      // Se digitar 121100, vira 1.211,00
      const numericValue = parseInt(rawValue);
      const formattedValue = this.formatCurrencyValue(numericValue);
      this.value = formattedValue;
    } else {
      this.value = target.value;
    }

    this.valueChange.emit(this.value);
    this.onChange(this.value);
    this.input.emit(event);
  }

  onBlur(event: Event): void {
    this.onTouched();
    this.blur.emit(event);
  }

  onFocus(event: Event): void {
    this.focus.emit(event);
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    // Usamos setTimeout para garantir que a máscara seja aplicada antes do valor ser definido,
    // especialmente quando a máscara é condicional.
    setTimeout(() => {
      this.value = value || '';
    });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private formatCurrencyValue(value: number): string {
    // Converte centavos para reais
    const reais = value / 100;

    // Formata com separadores brasileiros
    return reais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
