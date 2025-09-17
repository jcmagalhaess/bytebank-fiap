import { Component, Input } from '@angular/core';
import { IconProps } from './icon-props.interface';

@Component({
  selector: 'app-gear-icon',
  template: `
    <div
      [class]="'w-10 h-10 flex items-center justify-center rounded-full ' + bgColor"
    >
      <span
        [class]="'material-symbols-outlined text-xl ' + className"
      >
        settings
      </span>
    </div>
  `,
  standalone: true
})
export class GearIconComponent implements IconProps {
  @Input() className: string = '';
  @Input() bgColor: string = 'transparent';
  @Input() size?: string;
}
