import { Component, Input } from '@angular/core';
import { IconProps } from './icon-props.interface';

@Component({
  selector: 'app-arrow-down-icon',
  template: `
    <div
      [class]="'inline-flex items-center justify-center w-10 h-10 rounded-full ' + bgColor"
    >
      <span
        [class]="'material-symbols-outlined text-xl ' + className"
      >
        arrow_downward
      </span>
    </div>
  `,
  standalone: true
})
export class ArrowDownIconComponent implements IconProps {
  @Input() className: string = '';
  @Input() bgColor: string = 'bg-feedbackAction';
  @Input() size?: string;
}
