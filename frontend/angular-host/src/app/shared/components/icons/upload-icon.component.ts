import { Component, Input } from '@angular/core';
import { IconProps } from './icon-props.interface';

@Component({
  selector: 'app-upload-icon',
  template: `
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      [class]="size + ' ' + className"
    >
      <path d="M11 16V7.85L8.4 10.45L7 9L12 4L17 9L15.6 10.45L13 7.85V16H11ZM6 20C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V15H6V18H18V15H20V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H6Z" fill="currentColor"/>
    </svg>
  `,
  standalone: true
})
export class UploadIconComponent implements IconProps {
  @Input() className: string = '';
  @Input() bgColor: string = 'bg-transparent';
  @Input() size: string = 'w-6 h-6';
}
