import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputComponent } from '../../ui/input/input.component';
import { PdfUploadLoaderComponent } from '../../ui/loader';
import { TransactionType } from '../edit-transaction-modal/edit-transaction-modal.component';

export interface NewTransactionData {
  type: TransactionType;
  amount: number;
  date: string;
  descricao: string;
  categoria: string;
  pdfUrl?: string;
  pdfFileName?: string;
}

@Component({
  selector: 'app-new-transaction-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent, PdfUploadLoaderComponent],
  templateUrl: './new-transaction-form.component.html',
})
export class NewTransactionFormComponent {
  @Input() loading: boolean = false;
  @Output() add = new EventEmitter<NewTransactionData>();

  type: TransactionType = 'credit';
  amount: string = '';
  categoria: string = '';
  descricao: string = '';
  showModal: boolean = false;

  // Estados de erro
  valorErro: string = '';
  categoriaErro: string = '';
  descricaoErro: string = '';

  // Estados de sugestões
  sugestoes: string[] = [];
  showSuggestions: boolean = false;

  // Estados de PDF
  pdfFile: File | null = null;
  pdfUploading: boolean = false;
  pdfUploaded: boolean = false;
  pdfUrl: string = '';

  // Toast
  toastMessage: { type: 'success' | 'error'; message: string } | null = null;

  transactionOptions = [
    { label: 'Receita', value: 'credit', bold: true },
    { label: 'Despesa', value: 'transfer', bold: true },
  ];

  onTypeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.type = target.value as TransactionType;
  }

  onCategoriaChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const valor = inputElement.value;
    this.categoria = valor;

    // Limpa o erro quando o usuário começa a digitar
    if (this.categoriaErro) {
      this.categoriaErro = '';
    }

    if (valor.trim()) {
      const sugestoesEncontradas = this.getCategorySuggestions(valor);
      this.sugestoes = sugestoesEncontradas;
      this.showSuggestions = sugestoesEncontradas.length > 0;
    } else {
      this.sugestoes = [];
      this.showSuggestions = false;
    }
  }

  onCategoriaFocus(): void {
    // Só mostra sugestões se já tiver algo digitado
    if (this.categoria.trim()) {
      const sugestoesEncontradas = this.getCategorySuggestions(this.categoria);
      this.sugestoes = sugestoesEncontradas;
      this.showSuggestions = sugestoesEncontradas.length > 0;
    } else {
      this.sugestoes = [];
      this.showSuggestions = false;
    }
  }

  onCategoriaBlur(): void {
    // Delay para permitir clique nas sugestões
    setTimeout(() => (this.showSuggestions = false), 200);
  }

  selectSuggestion(suggestion: string): void {
    this.categoria = suggestion;
    this.sugestoes = [];
    this.showSuggestions = false;
  }

  onDescricaoChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.descricao = inputElement.value;

    // Limpa o erro quando o usuário começa a digitar
    if (this.descricaoErro) {
      this.descricaoErro = '';
    }
  }

  onAmountKeyPress(event: KeyboardEvent): void {
    // Permite apenas números (0-9)
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onAmountChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const raw = inputElement.value.replace(/\D/g, '');

    // Limita a 8 dígitos (máximo R$ 9.999.999,99 - casa do milhão)
    if (raw.length <= 8) {
      this.amount = raw;
      // Atualiza o valor do input para mostrar apenas números
      inputElement.value = this.formatAmountToBRL(raw);
    } else {
      // Se excedeu o limite, mantém o valor anterior
      inputElement.value = this.formatAmountToBRL(this.amount);
    }

    // Limpa o erro quando o usuário começa a digitar
    if (this.valorErro) {
      this.valorErro = '';
    }
  }

  formatAmountToBRL(value: string): string {
    const num = Number(value.replace(/\D/g, '')) / 100;
    if (isNaN(num)) return '';
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  validateValor(v: string): string {
    if (!v) return 'O valor é obrigatório';
    const num = Number(v.replace(/\D/g, '')) / 100;
    if (isNaN(num)) return 'Digite apenas números';
    if (num <= 0) return 'O valor deve ser maior que zero';
    if (num > 9999999.99) return 'O valor não pode exceder R$ 9.999.999,99';
    return '';
  }

  validateCategoria(c: string): string {
    if (!c) return 'A categoria é obrigatória';

    // Verifica se a categoria digitada é válida (exata ou sinônimo)
    const categoriaValida = this.findCategoryBySynonym(c);
    const isOfficialCategory = this.getAllCategories().includes(c);

    if (!categoriaValida && !isOfficialCategory) {
      return 'Categoria inválida. Selecione uma das sugestões ou digite um sinônimo válido.';
    }

    return '';
  }

  validateDescricao(d: string): string {
    if (!d.trim()) return 'A descrição é obrigatória';
    if (d.trim().length < 3) return 'A descrição deve ter pelo menos 3 caracteres';
    return '';
  }

  resetForm(): void {
    this.type = 'credit';
    this.amount = '';
    this.categoria = '';
    this.descricao = '';
    this.sugestoes = [];
    this.showSuggestions = false;
    this.pdfFile = null;
    this.pdfUploaded = false;
    this.pdfUrl = '';
    this.valorErro = '';
    this.categoriaErro = '';
    this.descricaoErro = '';
  }

  showToast(type: 'success' | 'error', message: string): void {
    this.toastMessage = { type, message };
    setTimeout(() => (this.toastMessage = null), 3000);
  }

  async handlePdfUpload(file: File): Promise<void> {
    // Validação do tipo de arquivo
    if (file.type !== 'application/pdf') {
      this.showToast('error', 'Apenas arquivos PDF são permitidos');
      return;
    }

    // Validação do tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('error', 'O arquivo deve ter no máximo 5MB');
      return;
    }

    this.pdfUploading = true;
    this.pdfFile = file;

    try {
      // Simular upload (substitua pela sua lógica de upload real)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simular URL do arquivo (substitua pela URL real do seu servidor)
      const mockUrl = URL.createObjectURL(file);
      this.pdfUrl = mockUrl;
      this.pdfUploaded = true;
      this.showToast('success', 'Comprovante carregado com sucesso!');
    } catch (error) {
      this.showToast('error', 'Erro ao carregar o comprovante. Tente novamente.');
      this.pdfFile = null;
    } finally {
      this.pdfUploading = false;
    }
  }

  onPdfChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    if (file) {
      this.handlePdfUpload(file);
    }
  }

  removePdf(): void {
    this.pdfFile = null;
    this.pdfUploaded = false;
    this.pdfUrl = '';
  }

  async confirmTransaction(): Promise<void> {
    this.loading = true;
    this.showModal = false;

    // Converte sinônimo para categoria oficial se necessário
    const categoriaFinal = this.findCategoryBySynonym(this.categoria) || this.categoria;

    const transactionData: NewTransactionData = {
      type: this.type,
      amount: Number(this.amount) / 100,
      date: this.getTodayISO(),
      categoria: categoriaFinal,
      descricao: this.descricao.trim(),
      pdfUrl: this.pdfUrl || undefined,
      pdfFileName: this.pdfFile?.name || undefined,
    };

    // Validar dados antes de emitir
    const erroValor = this.validateValor(this.amount);
    const erroCategoria = this.validateCategoria(this.categoria);
    const erroDescricao = this.validateDescricao(this.descricao);

    if (erroValor || erroCategoria || erroDescricao) {
      this.showToast('error', 'Dados inválidos. Verifique os campos preenchidos.');
      this.loading = false;
      return;
    }

    this.add.emit(transactionData);
    this.loading = false;
    this.resetForm();
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    const erroValor = this.validateValor(this.amount);
    const erroCategoria = this.validateCategoria(this.categoria);
    const erroDescricao = this.validateDescricao(this.descricao);

    this.valorErro = erroValor;
    this.categoriaErro = erroCategoria;
    this.descricaoErro = erroDescricao;

    if (erroValor || erroCategoria || erroDescricao) return;

    this.showModal = true;
  }

  // Métodos de categorias (reutilizados do EditTransactionModal)
  private getCategorySuggestions(input: string): string[] {
    const categories = ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Outros'];
    if (!input.trim()) return categories;

    const normalizedInput = input.toLowerCase().trim();
    const suggestions: string[] = [];

    // Verifica categorias que contêm o input
    categories.forEach((category) => {
      if (category.toLowerCase().includes(normalizedInput)) {
        suggestions.push(category);
      }
    });

    // Verifica sinônimos que contêm o input
    const synonyms = this.getAllSynonyms();
    Object.entries(synonyms).forEach(([synonym, category]) => {
      if (synonym.includes(normalizedInput) && !suggestions.includes(category)) {
        suggestions.push(category);
      }
    });

    return suggestions;
  }

  private getAllSynonyms(): Record<string, string> {
    return {
      // TRANSPORTE - Combustíveis
      combustível: 'Transporte',
      gasolina: 'Transporte',
      álcool: 'Transporte',
      diesel: 'Transporte',
      etanol: 'Transporte',
      aditivada: 'Transporte',
      premium: 'Transporte',
      comum: 'Transporte',
      posto: 'Transporte',
      abastecimento: 'Transporte',
      tanque: 'Transporte',

      // TRANSPORTE - Aplicativos e Serviços
      uber: 'Transporte',
      taxi: 'Transporte',
      '99': 'Transporte',
      cabify: 'Transporte',
      inDrive: 'Transporte',
      max: 'Transporte',
      bolt: 'Transporte',
      aplicativo: 'Transporte',
      app: 'Transporte',
      corrida: 'Transporte',
      viagem: 'Transporte',
      deslocamento: 'Transporte',

      // TRANSPORTE - Transporte Público
      ônibus: 'Transporte',
      metrô: 'Transporte',
      trem: 'Transporte',
      passagem: 'Transporte',
      bilhete: 'Transporte',
      cartão: 'Transporte',
      'vale-transporte': 'Transporte',
      vale: 'Transporte',
      'transporte público': 'Transporte',
      coletivo: 'Transporte',
      lotação: 'Transporte',
      van: 'Transporte',
      'micro-ônibus': 'Transporte',

      // TRANSPORTE - Veículos e Manutenção
      carro: 'Transporte',
      moto: 'Transporte',
      bicicleta: 'Transporte',
      bike: 'Transporte',
      patinete: 'Transporte',
      scooter: 'Transporte',
      manutenção: 'Transporte',
      revisão: 'Transporte',
      pneu: 'Transporte',
      pneus: 'Transporte',
      óleo: 'Transporte',
      filtro: 'Transporte',
      bateria: 'Transporte',
      freio: 'Transporte',
      embreagem: 'Transporte',
      motor: 'Transporte',
      mecânico: 'Transporte',
      oficina: 'Transporte',
      'auto peças': 'Transporte',
      peças: 'Transporte',

      // TRANSPORTE - Documentos e Seguros
      seguro: 'Transporte',
      ipva: 'Transporte',
      licenciamento: 'Transporte',
      multa: 'Transporte',
      multas: 'Transporte',
      detran: 'Transporte',
      cnh: 'Transporte',
      carteira: 'Transporte',
      documento: 'Transporte',
      renavam: 'Transporte',
      crlv: 'Transporte',

      // TRANSPORTE - Outros
      estacionamento: 'Transporte',
      pedágio: 'Transporte',
      pedágios: 'Transporte',
      lavagem: 'Transporte',
      'lava-jato': 'Transporte',
      guincho: 'Transporte',
      reboque: 'Transporte',

      // ALIMENTAÇÃO - Comida Geral
      comida: 'Alimentação',
      alimento: 'Alimentação',
      alimentos: 'Alimentação',
      refeição: 'Alimentação',
      refeições: 'Alimentação',
      lanche: 'Alimentação',
      lanches: 'Alimentação',
      petisco: 'Alimentação',
      petiscos: 'Alimentação',
      snack: 'Alimentação',
      snacks: 'Alimentação',

      // ALIMENTAÇÃO - Restaurantes e Delivery
      restaurante: 'Alimentação',
      restaurantes: 'Alimentação',
      lanchonete: 'Alimentação',
      lanchonetes: 'Alimentação',
      delivery: 'Alimentação',
      entrega: 'Alimentação',
      ifood: 'Alimentação',
      'uber eats': 'Alimentação',
      rappi: 'Alimentação',
      iFood: 'Alimentação',
      'Uber Eats': 'Alimentação',
      Rappi: 'Alimentação',
      pedido: 'Alimentação',
      pedidos: 'Alimentação',
      comanda: 'Alimentação',
      cardápio: 'Alimentação',

      // ALIMENTAÇÃO - Compras
      supermercado: 'Alimentação',
      supermercados: 'Alimentação',
      mercado: 'Alimentação',
      mercados: 'Alimentação',
      hipermercado: 'Alimentação',
      atacado: 'Alimentação',
      atacarejo: 'Alimentação',
      padaria: 'Alimentação',
      padarias: 'Alimentação',
      açougue: 'Alimentação',
      açougues: 'Alimentação',
      feira: 'Alimentação',
      feiras: 'Alimentação',
      hortifruti: 'Alimentação',
      verdureiro: 'Alimentação',
      peixaria: 'Alimentação',
      peixarias: 'Alimentação',
      loja: 'Alimentação',
      lojas: 'Alimentação',
      compra: 'Alimentação',
      compras: 'Alimentação',
      shopping: 'Alimentação',

      // ALIMENTAÇÃO - Refeições
      'café da manhã': 'Alimentação',
      desjejum: 'Alimentação',
      almoço: 'Alimentação',
      jantar: 'Alimentação',
      ceia: 'Alimentação',
      brunch: 'Alimentação',
      'happy hour': 'Alimentação',
      rodízio: 'Alimentação',
      buffet: 'Alimentação',
      'self-service': 'Alimentação',

      // ALIMENTAÇÃO - Bebidas
      bebida: 'Alimentação',
      bebidas: 'Alimentação',
      refrigerante: 'Alimentação',
      refrigerantes: 'Alimentação',
      suco: 'Alimentação',
      sucos: 'Alimentação',
      água: 'Alimentação',
      cerveja: 'Alimentação',
      cervejas: 'Alimentação',
      vinho: 'Alimentação',
      vinhos: 'Alimentação',
      whisky: 'Alimentação',
      vodka: 'Alimentação',
      cachaça: 'Alimentação',
      pinga: 'Alimentação',
      caipirinha: 'Alimentação',
      drink: 'Alimentação',
      drinks: 'Alimentação',
      coquetel: 'Alimentação',
      coquetéis: 'Alimentação',

      // ALIMENTAÇÃO - Tipos de Comida
      pizza: 'Alimentação',
      hambúrguer: 'Alimentação',
      hamburguer: 'Alimentação',
      sanduíche: 'Alimentação',
      sanduiche: 'Alimentação',
      salada: 'Alimentação',
      saladas: 'Alimentação',
      sopa: 'Alimentação',
      sopas: 'Alimentação',
      massa: 'Alimentação',
      massas: 'Alimentação',
      macarrão: 'Alimentação',
      macarrao: 'Alimentação',
      arroz: 'Alimentação',
      feijão: 'Alimentação',
      feijao: 'Alimentação',
      carne: 'Alimentação',
      carnes: 'Alimentação',
      frango: 'Alimentação',
      peixe: 'Alimentação',
      peixes: 'Alimentação',
      fruta: 'Alimentação',
      frutas: 'Alimentação',
      verdura: 'Alimentação',
      verduras: 'Alimentação',
      legume: 'Alimentação',
      legumes: 'Alimentação',

      // SAÚDE - Profissionais
      médico: 'Saúde',
      médicos: 'Saúde',
      doutor: 'Saúde',
      doutores: 'Saúde',
      doutora: 'Saúde',
      doutoras: 'Saúde',
      dentista: 'Saúde',
      dentistas: 'Saúde',
      odontologista: 'Saúde',
      psicólogo: 'Saúde',
      psicologo: 'Saúde',
      psicóloga: 'Saúde',
      psicologa: 'Saúde',
      fisioterapeuta: 'Saúde',
      fisioterapeutas: 'Saúde',
      nutricionista: 'Saúde',
      nutricionistas: 'Saúde',
      enfermeiro: 'Saúde',
      enfermeiros: 'Saúde',
      enfermeira: 'Saúde',
      enfermeiras: 'Saúde',
      terapeuta: 'Saúde',
      terapeutas: 'Saúde',

      // SAÚDE - Locais
      hospital: 'Saúde',
      hospitais: 'Saúde',
      clínica: 'Saúde',
      clinica: 'Saúde',
      clínicas: 'Saúde',
      clinicas: 'Saúde',
      consultório: 'Saúde',
      consultorio: 'Saúde',
      consultórios: 'Saúde',
      consultorios: 'Saúde',
      laboratório: 'Saúde',
      laboratorio: 'Saúde',
      laboratórios: 'Saúde',
      laboratorios: 'Saúde',
      'posto de saúde': 'Saúde',
      ubs: 'Saúde',
      ambulatório: 'Saúde',
      ambulatorio: 'Saúde',
      'pronto-socorro': 'Saúde',
      emergência: 'Saúde',
      emergencia: 'Saúde',

      // SAÚDE - Medicamentos e Farmácia
      farmacia: 'Saúde',
      farmácia: 'Saúde',
      farmacias: 'Saúde',
      farmácias: 'Saúde',
      drogaria: 'Saúde',
      drogarias: 'Saúde',
      remédio: 'Saúde',
      remedio: 'Saúde',
      remédios: 'Saúde',
      remedios: 'Saúde',
      medicamento: 'Saúde',
      medicamentos: 'Saúde',
      medicina: 'Saúde',
      pílula: 'Saúde',
      pilula: 'Saúde',
      pílulas: 'Saúde',
      pilulas: 'Saúde',
      comprimido: 'Saúde',
      comprimidos: 'Saúde',
      cápsula: 'Saúde',
      capsula: 'Saúde',
      cápsulas: 'Saúde',
      capsulas: 'Saúde',
      xarope: 'Saúde',
      xaropes: 'Saúde',
      pomada: 'Saúde',
      pomadas: 'Saúde',
      creme: 'Saúde',
      cremes: 'Saúde',
      vitamina: 'Saúde',
      vitaminas: 'Saúde',
      suplemento: 'Saúde',
      suplementos: 'Saúde',

      // SAÚDE - Exames e Consultas
      exame: 'Saúde',
      exames: 'Saúde',
      consulta: 'Saúde',
      consultas: 'Saúde',
      'check-up': 'Saúde',
      checkup: 'Saúde',
      'raio-x': 'Saúde',
      raiox: 'Saúde',
      ultrassom: 'Saúde',
      tomografia: 'Saúde',
      ressonância: 'Saúde',
      ressonancia: 'Saúde',
      sangue: 'Saúde',
      urina: 'Saúde',
      fezes: 'Saúde',
      biópsia: 'Saúde',
      biopsia: 'Saúde',
      vacina: 'Saúde',
      vacinas: 'Saúde',
      vacinação: 'Saúde',
      vacinacao: 'Saúde',

      // SAÚDE - Planos e Convênios
      'plano de saúde': 'Saúde',
      plano: 'Saúde',
      planos: 'Saúde',
      convênio: 'Saúde',
      convenio: 'Saúde',
      convênios: 'Saúde',
      convenios: 'Saúde',
      unimed: 'Saúde',
      amil: 'Saúde',
      bradesco: 'Saúde',
      sulamerica: 'Saúde',
      notredame: 'Saúde',
      hapvida: 'Saúde',
      prevent: 'Saúde',
      sus: 'Saúde',

      // EDUCAÇÃO - Instituições
      escola: 'Educação',
      escolas: 'Educação',
      colégio: 'Educação',
      colegio: 'Educação',
      colégios: 'Educação',
      colegios: 'Educação',
      faculdade: 'Educação',
      faculdades: 'Educação',
      universidade: 'Educação',
      universidades: 'Educação',
      uni: 'Educação',
      uniesp: 'Educação',
      fiap: 'Educação',
      puc: 'Educação',
      usp: 'Educação',
      unifesp: 'Educação',
      mackenzie: 'Educação',
      anhembi: 'Educação',
      uninove: 'Educação',
      anhanguera: 'Educação',
      estácio: 'Educação',
      estacio: 'Educação',
      pitágoras: 'Educação',
      pitagoras: 'Educação',
      'cruzeiro do sul': 'Educação',
      unip: 'Educação',

      // EDUCAÇÃO - Cursos e Materiais
      curso: 'Educação',
      cursos: 'Educação',
      graduação: 'Educação',
      graduacao: 'Educação',
      'pós-graduação': 'Educação',
      'pos-graduacao': 'Educação',
      mestrado: 'Educação',
      doutorado: 'Educação',
      mba: 'Educação',
      especialização: 'Educação',
      especializacao: 'Educação',
      técnico: 'Educação',
      tecnico: 'Educação',
      livro: 'Educação',
      livros: 'Educação',
      material: 'Educação',
      materiais: 'Educação',
      caderno: 'Educação',
      cadernos: 'Educação',
      caneta: 'Educação',
      canetas: 'Educação',
      lápis: 'Educação',
      lapis: 'Educação',
      borracha: 'Educação',
      borrachas: 'Educação',
      mochila: 'Educação',
      mochilas: 'Educação',
      estojos: 'Educação',
      estojo: 'Educação',

      // EDUCAÇÃO - Pagamentos
      mensalidade: 'Educação',
      mensalidades: 'Educação',
      matrícula: 'Educação',
      matricula: 'Educação',
      matrículas: 'Educação',
      matriculas: 'Educação',
      taxa: 'Educação',
      taxas: 'Educação',
      inscrição: 'Educação',
      inscricao: 'Educação',
      inscrições: 'Educação',
      inscricoes: 'Educação',
      vestibular: 'Educação',
      vestibulares: 'Educação',
      enem: 'Educação',
      prova: 'Educação',
      provas: 'Educação',

      // LAZER - Entretenimento
      cinema: 'Lazer',
      filme: 'Lazer',
      filmes: 'Lazer',
      teatro: 'Lazer',
      show: 'Lazer',
      shows: 'Lazer',
      concerto: 'Lazer',
      concertos: 'Lazer',
      festa: 'Lazer',
      festas: 'Lazer',
      balada: 'Lazer',
      baladas: 'Lazer',
      boate: 'Lazer',
      boates: 'Lazer',
      bar: 'Lazer',
      bares: 'Lazer',
      pub: 'Lazer',
      pubs: 'Lazer',

      // LAZER - Streaming e Mídia
      streaming: 'Lazer',
      netflix: 'Lazer',
      Netflix: 'Lazer',
      spotify: 'Lazer',
      Spotify: 'Lazer',
      'amazon prime': 'Lazer',
      disney: 'Lazer',
      Disney: 'Lazer',
      'disney+': 'Lazer',
      hbo: 'Lazer',
      HBO: 'Lazer',
      'hbo max': 'Lazer',
      'globo play': 'Lazer',
      youtube: 'Lazer',
      YouTube: 'Lazer',
      'youtube premium': 'Lazer',
      'apple music': 'Lazer',
      deezer: 'Lazer',
      tidal: 'Lazer',
      twitch: 'Lazer',
      'prime video': 'Lazer',

      // LAZER - Jogos
      jogo: 'Lazer',
      jogos: 'Lazer',
      videogame: 'Lazer',
      videogames: 'Lazer',
      playstation: 'Lazer',
      PlayStation: 'Lazer',
      xbox: 'Lazer',
      Xbox: 'Lazer',
      nintendo: 'Lazer',
      Nintendo: 'Lazer',
      steam: 'Lazer',
      Steam: 'Lazer',
      pc: 'Lazer',
      computador: 'Lazer',
      mobile: 'Lazer',
      celular: 'Lazer',
      smartphone: 'Lazer',
      tablet: 'Lazer',
      console: 'Lazer',
      consoles: 'Lazer',

      // LAZER - Viagem e Turismo
      viagens: 'Lazer',
      turismo: 'Lazer',
      hotel: 'Lazer',
      hoteis: 'Lazer',
      hotéis: 'Lazer',
      pousada: 'Lazer',
      pousadas: 'Lazer',
      hospedagem: 'Lazer',
      airbnb: 'Lazer',
      Airbnb: 'Lazer',
      booking: 'Lazer',
      Booking: 'Lazer',
      trivago: 'Lazer',
      Trivago: 'Lazer',
      passagens: 'Lazer',
      aéreo: 'Lazer',
      aereo: 'Lazer',
      aéreos: 'Lazer',
      aereos: 'Lazer',
      onibus: 'Lazer',
      trens: 'Lazer',
      cruzeiro: 'Lazer',
      cruzeiros: 'Lazer',
      passeio: 'Lazer',
      passeios: 'Lazer',
      excursão: 'Lazer',
      excursoes: 'Lazer',
      excursões: 'Lazer',
      tour: 'Lazer',
      tours: 'Lazer',
      guia: 'Lazer',
      guias: 'Lazer',

      // LAZER - Esportes e Atividades
      academia: 'Lazer',
      academias: 'Lazer',
      ginásio: 'Lazer',
      ginasio: 'Lazer',
      ginásios: 'Lazer',
      ginasios: 'Lazer',
      personal: 'Lazer',
      'personal trainer': 'Lazer',
      crossfit: 'Lazer',
      CrossFit: 'Lazer',
      pilates: 'Lazer',
      Pilates: 'Lazer',
      yoga: 'Lazer',
      Yoga: 'Lazer',
      natação: 'Lazer',
      natacao: 'Lazer',
      futebol: 'Lazer',
      basquete: 'Lazer',
      vôlei: 'Lazer',
      volei: 'Lazer',
      tênis: 'Lazer',
      tenis: 'Lazer',
      piscina: 'Lazer',
      piscinas: 'Lazer',
      quadra: 'Lazer',
      quadras: 'Lazer',
      campo: 'Lazer',
      campos: 'Lazer',
      estádio: 'Lazer',
      estadio: 'Lazer',
      estádios: 'Lazer',
      estadios: 'Lazer',

      // OUTROS - Casa e Jardim
      casa: 'Outros',
      lar: 'Outros',
      residência: 'Outros',
      residencia: 'Outros',
      apartamento: 'Outros',
      apartamentos: 'Outros',
      condomínio: 'Outros',
      condominio: 'Outros',
      condomínios: 'Outros',
      condominios: 'Outros',
      aluguel: 'Outros',
      financiamento: 'Outros',
      financiamentos: 'Outros',
      prestação: 'Outros',
      prestacao: 'Outros',
      prestações: 'Outros',
      prestacoes: 'Outros',
      parcela: 'Outros',
      parcelas: 'Outros',
      jardim: 'Outros',
      jardins: 'Outros',
      paisagismo: 'Outros',
      decoração: 'Outros',
      decoracao: 'Outros',
      móveis: 'Outros',
      móvel: 'Outros',
      eletrodomésticos: 'Outros',
      eletrodomesticos: 'Outros',
      eletrodoméstico: 'Outros',
      eletrodomestico: 'Outros',
      geladeira: 'Outros',
      fogão: 'Outros',
      fogao: 'Outros',
      'micro-ondas': 'Outros',
      microondas: 'Outros',
      'máquina de lavar': 'Outros',
      'maquina de lavar': 'Outros',
      televisão: 'Outros',
      televisao: 'Outros',
      tv: 'Outros',
      'ar condicionado': 'Outros',
      ventilador: 'Outros',
      ventiladores: 'Outros',

      // OUTROS - Serviços
      limpeza: 'Outros',
      faxina: 'Outros',
      empregada: 'Outros',
      doméstica: 'Outros',
      domestica: 'Outros',
      diarista: 'Outros',
      lavanderia: 'Outros',
      lavanderias: 'Outros',
      tinturaria: 'Outros',
      tinturarias: 'Outros',
      conserto: 'Outros',
      consertos: 'Outros',
      reparo: 'Outros',
      reparos: 'Outros',
      manutencao: 'Outros',
      instalação: 'Outros',
      instalacao: 'Outros',
      instalações: 'Outros',
      instalacoes: 'Outros',
      reforma: 'Outros',
      reformas: 'Outros',
      construção: 'Outros',
      construcao: 'Outros',
      pedreiro: 'Outros',
      pedreiros: 'Outros',
      eletricista: 'Outros',
      eletricistas: 'Outros',
      encanador: 'Outros',
      encanadores: 'Outros',
      pintor: 'Outros',
      pintores: 'Outros',
      pintura: 'Outros',
      pinturas: 'Outros',

      // OUTROS - Pets
      pet: 'Outros',
      pets: 'Outros',
      animal: 'Outros',
      animais: 'Outros',
      cachorro: 'Outros',
      cachorros: 'Outros',
      gato: 'Outros',
      gatos: 'Outros',
      veterinário: 'Outros',
      veterinario: 'Outros',
      veterinários: 'Outros',
      veterinarios: 'Outros',
      veterinária: 'Outros',
      veterinaria: 'Outros',
      veterinárias: 'Outros',
      veterinarias: 'Outros',
      'pet shop': 'Outros',
      petshop: 'Outros',
      ração: 'Outros',
      racao: 'Outros',
      rações: 'Outros',
      racoes: 'Outros',
      brinquedo: 'Outros',
      brinquedos: 'Outros',
      coleira: 'Outros',
      coleiras: 'Outros',
      banho: 'Outros',
      banhos: 'Outros',
      tosa: 'Outros',
      tosas: 'Outros',

      // OUTROS - Impostos e Contas
      imposto: 'Outros',
      impostos: 'Outros',
      iptu: 'Outros',
      luz: 'Outros',
      energia: 'Outros',
      eletricidade: 'Outros',
      agua: 'Outros',
      gás: 'Outros',
      gas: 'Outros',
      telefone: 'Outros',
      internet: 'Outros',
      'wi-fi': 'Outros',
      wifi: 'Outros',
      'tv a cabo': 'Outros',
      cabo: 'Outros',
      satélite: 'Outros',
      satelite: 'Outros',
      assinatura: 'Outros',
      assinaturas: 'Outros',
      telefonia: 'Outros',
      dados: 'Outros',
      minutos: 'Outros',
      sms: 'Outros',
      whatsapp: 'Outros',
      WhatsApp: 'Outros',
    };
  }

  getAllCategories(): string[] {
    return ['Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Outros'];
  }

  findCategoryBySynonym(input: string): string | null {
    const synonyms = this.getAllSynonyms();
    const normalizedInput = input.toLowerCase().trim();
    return synonyms[normalizedInput] || null;
  }

  getTodayISO(): string {
    return new Date().toISOString().split('T')[0];
  }
}
