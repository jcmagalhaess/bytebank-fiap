import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
