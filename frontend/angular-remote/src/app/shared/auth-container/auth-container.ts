import { Component, input } from '@angular/core';

@Component({
  selector: 'app-auth-container',
  imports: [],
  templateUrl: './auth-container.html',
  styleUrl: './auth-container.scss',
})
export class AuthContainer {
  login = input<boolean>(true);
  titulo = input.required<string>();
  descricao = input.required<string>();
}
