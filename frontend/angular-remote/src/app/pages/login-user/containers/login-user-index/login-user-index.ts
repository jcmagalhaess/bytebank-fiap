import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthContainer } from '../../../../shared/auth-container/auth-container';

@Component({
  selector: 'app-login-user-index',
  imports: [ReactiveFormsModule, AuthContainer],
  templateUrl: './login-user-index.html',
  styleUrl: './login-user-index.scss',
})
export class LoginUserIndex {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  /**
   * Função chamada quando o formulário de login é submetido.
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Formulário enviado!', this.loginForm.value);
    }
  }
}
