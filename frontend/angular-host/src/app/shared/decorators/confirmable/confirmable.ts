import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '../../components/ui';

@Component({
  selector: 'app-confirmable',
  templateUrl: './confirmable.html',
  imports: [ButtonComponent],
})
export class Confirmable {
  public isOpen = input<boolean>(false);
  public title = input<string>('Confirmar Ação');
  public message = input<string>('Você tem certeza que deseja prosseguir?');

  public confirm = output<void>();
  public cancel = output<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
