import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export type PageContainerVariant = 'highlight' | 'sectioned' | 'form';

@Component({
  selector: 'app-page-container',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './page-container.component.html',
})
export class PageContainerComponent {
  @Input() className: string = '';
  @Input() bgColor: string = 'bg-backgroundPrimary';
  @Input() withBackgroundPattern: boolean = false;
  @Input() variant?: PageContainerVariant;
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() exibirExtratoLink: boolean = true;
  @Input() exibirBotaoVoltar: boolean = false;
  @Input() customHeader?: TemplateRef<any>;
  @Input() pagination?: TemplateRef<any>;

  @Output() onExtratoLinkClick = new EventEmitter<void>();
  @Output() onVoltarClick = new EventEmitter<void>();

  get baseClasses(): string {
    return 'relative p-4 sm:p-10 mb-6';
  }

  get variantClasses(): { [key in PageContainerVariant]: string } {
    return {
      highlight: [
        'text-backgroundPrimary flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0 sm:p-10 p-6',
        'bg-gradient-to-r from-brandSecondary via-brandPrimary to-brandSecondary h-[250px]',
        'relative overflow-hidden -mx-4 sm:-mx-10 m-0 p-0'
      ].join(' '),
      sectioned: [
        'bg-backgroundSecondary shadow-md rounded-xl p-4 sm:p-6 w-full h-[100%]',
        'flex flex-col gap-md'
      ].join(' '),
      form: 'bg-backgroundPrimary rounded-xl p-4 sm:p-6 shadow-md'
    };
  }

  get containerClasses(): string {
    const classes = [this.baseClasses];

    if (this.variant) {
      classes.push(this.variantClasses[this.variant]);
    } else {
      classes.push(this.bgColor);
    }

    if (this.className) {
      classes.push(this.className);
    }

    return classes.join(' ');
  }

  get currentPath(): string {
    // Simulação do pathname - em uma aplicação real, você usaria o Router
    return window.location.pathname;
  }

  onExtratoLinkClickHandler(): void {
    this.onExtratoLinkClick.emit();
  }

  onVoltarClickHandler(): void {
    this.onVoltarClick.emit();
  }
}
