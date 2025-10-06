import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-container',
  imports: [RouterLink],
  templateUrl: './auth-container.html',
  styleUrl: './auth-container.scss',
})
export class AuthContainer {
  login = input<boolean>(true);
  titulo = input.required<string>();
  descricao = input.required<string>();
}
