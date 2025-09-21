import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
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

  @Output() valueChange = new EventEmitter<string>();
  @Output() input = new EventEmitter<Event>();
  @Output() blur = new EventEmitter<Event>();
  @Output() focus = new EventEmitter<Event>();

  // ControlValueAccessor implementation
  private onChange = (value: string) => {};
  private onTouched = () => {};

  get inputClasses(): string {
    const baseClasses = 'px-sm py-3 border rounded-xl font-inter text-sm md:text-base text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2';

    const errorClasses = this.error
      ? 'border-feedbackDanger ring-feedbackDanger'
      : 'border-backgroundSecondary ring-brandPrimary';

    const disabledClasses = this.disabled ? 'bg-backgroundSecondary cursor-not-allowed' : '';

    return `${baseClasses} ${errorClasses} ${disabledClasses} ${this.class}`.trim();
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
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
    this.value = value || '';
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
}
