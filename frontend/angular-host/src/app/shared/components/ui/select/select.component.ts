import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string;
  bold?: boolean;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() options: SelectOption[] = [];
  @Input() error?: string;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() placeholder: string = '';
  @Input() class: string = '';
  @Input() value: string = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() change = new EventEmitter<Event>();

  // ControlValueAccessor implementation
  private onChange = (value: string) => {};
  private onTouched = () => {};

  get selectClasses(): string {
    const baseClasses = 'appearance-none w-full px-4 py-3 pr-10 border rounded-xl bg-white font-inter text-sm md:text-base text-textPrimary focus:outline-none focus:ring-2';

    const errorClasses = this.error
      ? 'border-feedbackDanger ring-red-200'
      : 'border-brandPrimary ring-blue-200';

    const disabledClasses = this.disabled ? 'bg-backgroundSecondary cursor-not-allowed' : '';

    return `${baseClasses} ${errorClasses} ${disabledClasses} ${this.class}`.trim();
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
    this.onChange(this.value);
    this.change.emit(event);
  }

  onBlur(event: Event): void {
    this.onTouched();
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




