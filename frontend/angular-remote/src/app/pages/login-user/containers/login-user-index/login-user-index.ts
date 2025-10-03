import { Component, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthContainer } from '../../../../shared/auth-container/auth-container';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-user-index',
  imports: [CommonModule, ReactiveFormsModule, AuthContainer],
  templateUrl: './login-user-index.html',
  styleUrl: './login-user-index.scss',
})
export class LoginUserIndex implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly renderer = inject(Renderer2);

  protected readonly loginForm: FormGroup;
  protected errorMessage: string | null = null;
  private unlisten: (() => void) | null = null;

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Ouve a resposta do host
    this.unlisten = this.renderer.listen(window, 'loginResponse', (event: CustomEvent) => {
      if (!event.detail.success) {
        this.errorMessage = event.detail.error || 'E-mail ou senha inválidos.';
      }
    });
  }

  /**
   * Função chamada quando o formulário de login é submetido.
   */
  onSubmit(): void {
    this.errorMessage = null;
    if (this.loginForm.valid) {
      // Dispara um evento customizado para o host ouvir
      const loginEvent = new CustomEvent('loginRequest', {
        detail: this.loginForm.value,
      });
      window.dispatchEvent(loginEvent);
    }
  }

  ngOnDestroy(): void {
    // Limpa o listener para evitar memory leaks
    if (this.unlisten) {
      this.unlisten();
    }
  }
}
