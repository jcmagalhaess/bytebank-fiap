import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import {
  ArrowDownIconComponent,
  ArrowRightIconComponent,
  ArrowUpIconComponent,
  AvatarIconComponent,
  EditIconComponent,
  GearIconComponent,
  SearchIconComponent,
  SettingIconComponent,
  TrashIconComponent,
  UploadIconComponent
} from './shared/components/icons';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    ArrowDownIconComponent,
    ArrowRightIconComponent,
    ArrowUpIconComponent,
    AvatarIconComponent,
    EditIconComponent,
    GearIconComponent,
    SearchIconComponent,
    SettingIconComponent,
    TrashIconComponent,
    UploadIconComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('angular-host');
}
