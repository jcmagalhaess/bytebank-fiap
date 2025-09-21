import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type LoaderSize = 'sm' | 'md' | 'lg';
export type LoaderColor = 'blue' | 'green' | 'gray';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class LoaderComponent {
  @Input() size: LoaderSize = 'md';
  @Input() color: LoaderColor = 'blue';
  @Input() text?: string;
  @Input() class: string = '';

  get sizeClasses(): string {
    const sizeMap = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12'
    };
    return sizeMap[this.size];
  }

  get colorClasses(): string {
    const colorMap = {
      blue: 'border-blue-500',
      green: 'border-green-500',
      gray: 'border-gray-500'
    };
    return colorMap[this.color];
  }

  get textSizeClasses(): string {
    const textSizeMap = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };
    return textSizeMap[this.size];
  }

  get innerCircleSize(): string {
    const innerSizeMap = {
      sm: 'h-1 w-1',
      md: 'h-2 w-2',
      lg: 'h-3 w-3'
    };
    return innerSizeMap[this.size];
  }
}

