import { Component, Input } from '@angular/core';
import { IconProps } from './icon-props.interface';

@Component({
  selector: 'app-arrow-up-icon',
  template: `
    <div
      [class]="'inline-flex items-center justify-center w-10 h-10 rounded-full ' + bgColor"
    >
      <span
        [class]="'material-symbols-outlined text-xl ' + className"
      >
        arrow_upward
      </span>
    </div>
  `,
  standalone: true
})
export class ArrowUpIconComponent implements IconProps {
  @Input() className: string = 'text-white';
  @Input() bgColor: string = 'bg-feedbackSuccess';
  @Input() size?: string;
}
