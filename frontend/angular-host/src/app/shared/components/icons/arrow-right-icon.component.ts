import { Component, Input } from '@angular/core';
import { IconProps } from './icon-props.interface';

@Component({
  selector: 'app-arrow-right-icon',
  template: `
    <div
      [class]="'w-10 h-10 flex items-center justify-center rounded-full ' + bgColor"
    >
      <span
        [class]="'material-symbols-outlined text-xl ' + className"
      >
        chevron_right
      </span>
    </div>
  `,
  standalone: true
})
export class ArrowRightIconComponent implements IconProps {
  @Input() className: string = '';
  @Input() bgColor: string = 'transparent';
  @Input() size?: string;
}
