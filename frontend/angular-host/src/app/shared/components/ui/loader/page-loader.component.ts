import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class PageLoaderComponent {
  @Input() text: string = 'Carregando...';
}
