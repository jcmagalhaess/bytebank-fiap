import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-upload-loader',
  templateUrl: './pdf-upload-loader.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class PdfUploadLoaderComponent {
  @Input() class: string = '';
}
