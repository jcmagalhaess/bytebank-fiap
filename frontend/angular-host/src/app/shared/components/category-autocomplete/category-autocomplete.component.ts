import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface CategorySuggestion {
  value: string;
  label: string;
  synonyms: string[];
}

@Component({
  selector: 'app-category-autocomplete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-autocomplete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoryAutocompleteComponent),
      multi: true
    }
  ]
})
export class CategoryAutocompleteComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Digite a categoria...';
  @Input() disabled: boolean = false;
  @Output() categorySelected = new EventEmitter<string>();

  // Categorias oficiais com seus sinônimos
  private categories: CategorySuggestion[] = [
    {
      value: 'alimentacao',
      label: 'Alimentação',
      synonyms: ['ifood', 'uber eats', 'rappi', 'comida', 'restaurante', 'lanchonete', 'padaria', 'supermercado', 'mercado', 'açougue', 'feira', 'delivery', 'entrega', 'refeição', 'jantar', 'almoço', 'café da manhã', 'lanche', 'petisco', 'snack']
    },
    {
      value: 'transporte',
      label: 'Transporte',
      synonyms: ['uber', '99', 'taxi', 'onibus', 'metro', 'trem', 'gasolina', 'combustivel', 'estacionamento', 'pedágio', 'bilhete', 'passagem', 'viagem', 'carro', 'moto', 'bicicleta', 'scooter', 'mobilidade']
    },
    {
      value: 'saude',
      label: 'Saúde',
      synonyms: ['farmacia', 'medicamento', 'remedio', 'hospital', 'clinica', 'medico', 'dentista', 'exame', 'consulta', 'plano de saude', 'sus', 'laboratorio', 'fisioterapia', 'psicologo', 'terapia', 'vacina', 'emergencia']
    },
    {
      value: 'educacao',
      label: 'Educação',
      synonyms: ['escola', 'faculdade', 'universidade', 'curso', 'livro', 'material escolar', 'mensalidade', 'matricula', 'apostila', 'caderno', 'caneta', 'lápis', 'estudo', 'educação', 'ensino', 'treinamento', 'workshop']
    },
    {
      value: 'entretenimento',
      label: 'Entretenimento',
      synonyms: ['cinema', 'netflix', 'spotify', 'youtube', 'jogo', 'game', 'festa', 'show', 'teatro', 'museu', 'parque', 'diversão', 'lazer', 'hobby', 'passatempo', 'streaming', 'filme', 'série', 'música']
    },
    {
      value: 'vestuario',
      label: 'Vestuário',
      synonyms: ['roupa', 'camisa', 'calça', 'sapato', 'tênis', 'bolsa', 'acessório', 'moda', 'loja', 'shopping', 'fashion', 'roupas', 'vestido', 'blusa', 'jaqueta', 'casaco', 'meia', 'cueca', 'sutiã']
    },
    {
      value: 'casa',
      label: 'Casa e Moradia',
      synonyms: ['aluguel', 'condominio', 'iptu', 'luz', 'agua', 'gas', 'internet', 'telefone', 'reforma', 'decoração', 'móveis', 'eletrodomesticos', 'limpeza', 'manutenção', 'jardim', 'piscina', 'segurança']
    },
    {
      value: 'tecnologia',
      label: 'Tecnologia',
      synonyms: ['celular', 'smartphone', 'computador', 'notebook', 'tablet', 'software', 'app', 'licença', 'assinatura', 'upgrade', 'manutenção', 'reparo', 'acessório', 'cabo', 'carregador', 'fone', 'mouse', 'teclado']
    },
    {
      value: 'pessoal',
      label: 'Pessoal',
      synonyms: ['cabelo', 'barba', 'unha', 'estética', 'spa', 'massagem', 'beleza', 'cosmético', 'perfume', 'creme', 'shampoo', 'sabonete', 'pasta de dente', 'escova', 'toalha', 'roupa íntima']
    },
    {
      value: 'investimentos',
      label: 'Investimentos',
      synonyms: ['poupança', 'cdb', 'lci', 'lca', 'tesouro', 'ações', 'fundo', 'investimento', 'aplicação', 'renda fixa', 'renda variável', 'bolsa', 'corretora', 'banco', 'financiamento']
    },
    {
      value: 'outros',
      label: 'Outros',
      synonyms: ['diversos', 'varios', 'outros', 'miscelânea', 'geral', 'diverso', 'variado', 'misto']
    }
  ];

  public inputValue: string = '';
  public suggestions: CategorySuggestion[] = [];
  public showSuggestions: boolean = false;
  public selectedCategory: string = '';

  private onChange = (value: string) => {};
  private onTouched = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.inputValue = target.value;

    if (this.inputValue.length > 0) {
      this.filterSuggestions();
      this.showSuggestions = true;
    } else {
      this.suggestions = [];
      this.showSuggestions = false;
    }
  }

  private filterSuggestions(): void {
    const searchTerm = this.inputValue.toLowerCase();

    this.suggestions = this.categories.filter(category => {
      // Busca no nome da categoria
      if (category.label.toLowerCase().includes(searchTerm)) {
        return true;
      }

      // Busca nos sinônimos
      return category.synonyms.some(synonym =>
        synonym.toLowerCase().includes(searchTerm)
      );
    });
  }

  selectSuggestion(category: CategorySuggestion): void {
    this.inputValue = category.label;
    this.selectedCategory = category.label; // Salva o label formatado, não o value
    this.showSuggestions = false;
    this.suggestions = [];

    this.onChange(category.label); // Envia o label formatado
    this.categorySelected.emit(category.label);
  }

  onBlur(): void {
    // Aguarda um pouco antes de esconder as sugestões para permitir clique
    setTimeout(() => {
      this.showSuggestions = false;
      this.onTouched();
    }, 200);
  }

  onFocus(): void {
    if (this.inputValue.length > 0) {
      this.filterSuggestions();
      this.showSuggestions = true;
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    if (value) {
      // Primeiro tenta encontrar por label (valor formatado)
      let category = this.categories.find(cat => cat.label === value);

      // Se não encontrar por label, tenta por value (valor interno)
      if (!category) {
        category = this.categories.find(cat => cat.value === value);
      }

      if (category) {
        this.inputValue = category.label;
        this.selectedCategory = category.label;
      } else {
        // Se não encontrar, assume que é um valor já formatado
        this.inputValue = value;
        this.selectedCategory = value;
      }
    } else {
      this.inputValue = '';
      this.selectedCategory = '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
