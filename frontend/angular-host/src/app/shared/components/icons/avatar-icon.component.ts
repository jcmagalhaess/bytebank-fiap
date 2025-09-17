import { Component, Input } from '@angular/core';
import { IconProps } from './icon-props.interface';

@Component({
  selector: 'app-avatar-icon',
  template: `
    <div
      [class]="'inline-flex items-center justify-center rounded-full ' + bgColor + ' ' + size"
    >
      <span
        [class]="'material-symbols-outlined ' + className"
        [style.font-size]="'32px'"
      >
        account_circle
      </span>
    </div>
  `,
  standalone: true
})
export class AvatarIconComponent implements IconProps {
  @Input() className: string = '';
  @Input() bgColor: string = 'transparent';
  @Input() size: string = 'w-10 h-10';
}
