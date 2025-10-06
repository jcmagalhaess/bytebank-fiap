import { Component, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthContainer } from '../../shared/auth-container/auth-container';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-login',
  imports: [CommonModule, ReactiveFormsModule, AuthContainer],
  templateUrl: './user-login.html',
  styleUrl: './user-login.scss',
})
export class UserLogin implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly renderer = inject(Renderer2);
  private readonly route = inject(ActivatedRoute);

  protected readonly loginForm: FormGroup;
  protected errorMessage: string | null = null;
  protected successMessage: string | null = null;
  private unlisten: (() => void) | null = null;

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Verifica se há um parâmetro 'registered' na URL
    if (this.route.snapshot.queryParamMap.get('registered') === 'success') {
      this.successMessage = 'Cadastro realizado com sucesso! Faça o login para continuar.';
    }

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
    this.successMessage = null; // Limpa a mensagem de sucesso ao tentar logar
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
