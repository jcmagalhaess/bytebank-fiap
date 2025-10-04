import { Component, OnDestroy, OnInit, Renderer2, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthContainer } from '../../shared/auth-container/auth-container';
import { CommonModule } from '@angular/common';

// Validador customizado para verificar se as senhas coincidem
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-user-registration',
  imports: [CommonModule, ReactiveFormsModule, AuthContainer],
  templateUrl: './user-registration.html',
  styleUrl: './user-registration.scss',
})
export class UserRegistration implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly renderer = inject(Renderer2);

  protected readonly registrationForm: FormGroup;
  protected errorMessage: string | null = null;
  private unlisten: (() => void) | null = null;

  constructor() {
    this.registrationForm = this.formBuilder.group(
      {
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Ouve a resposta do host após a tentativa de cadastro
    this.unlisten = this.renderer.listen(window, 'registrationResponse', (event: CustomEvent) => {
      if (!event.detail.success) {
        this.errorMessage = event.detail.error || 'Ocorreu um erro ao tentar realizar o cadastro.';
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.registrationForm.valid) {
      const { confirmPassword, ...registrationData } = this.registrationForm.value;
      const registrationEvent = new CustomEvent('registrationRequest', {
        detail: registrationData,
      });
      window.dispatchEvent(registrationEvent);
    }
  }

  ngOnDestroy(): void {
    if (this.unlisten) this.unlisten();
  }
}
