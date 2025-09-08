export interface CategoryConfig {
  name: string;
  synonyms: string[];
}

export const CATEGORIES_CONFIG: CategoryConfig[] = [
  {
    name: "Alimentação",
    synonyms: [
      "comida", "restaurante", "supermercado", "mercado", "lanche", 
      "café", "almoço", "jantar", "café da manhã", "desjejum",
      "delivery", "ifood", "uber eats", "rappi", "iFood"
    ]
  },
  {
    name: "Transporte",
    synonyms: [
      "combustível", "gasolina", "álcool", "diesel", "etanol",
      "uber", "taxi", "ônibus", "metrô", "trem", "passagem",
      "estacionamento", "pedágio", "manutenção", "pneu", "óleo",
      "seguro", "ipva", "licenciamento", "multa", "carro", "moto"
    ]
  },
  {
    name: "Lazer",
    synonyms: [
      "cinema", "teatro", "show", "festa", "balada", "bar",
      "viagem", "turismo", "hotel", "pousada", "hospedagem",
      "jogo", "videogame", "streaming", "netflix", "spotify",
      "academia", "esporte", "futebol", "natação", "corrida"
    ]
  },
  {
    name: "Salário",
    synonyms: [
      "renda", "salário", "proventos", "pagamento", "remuneração",
      "13º", "décimo terceiro", "férias", "adicional", "bonus",
      "comissão", "freelance", "trabalho", "emprego"
    ]
  },
  {
    name: "Educação",
    synonyms: [
      "curso", "faculdade", "universidade", "escola", "colégio",
      "livro", "material", "mensalidade", "matrícula", "taxa",
      "apostila", "caderno", "caneta", "lápis", "estudo"
    ]
  },
  {
    name: "Saúde",
    synonyms: [
      "médico", "hospital", "clínica", "farmácia", "remédio",
      "medicamento", "consulta", "exame", "laboratório", "dentista",
      "plano", "convênio", "sus", "emergência", "ambulância"
    ]
  },
  {
    name: "Moradia",
    synonyms: [
      "aluguel", "financiamento", "condomínio", "iptu", "luz",
      "água", "gás", "internet", "telefone", "energia elétrica",
      "reforma", "construção", "móveis", "eletrodomésticos",
      "casa", "apartamento", "imóvel", "propriedade"
    ]
  }
];

export function findCategoryBySynonym(input: string): string | null {
  const normalizedInput = input.toLowerCase().trim();
  
  // Primeiro, verifica se é uma categoria exata
  const exactMatch = CATEGORIES_CONFIG.find(
    category => category.name.toLowerCase() === normalizedInput
  );
  if (exactMatch) {
    return exactMatch.name;
  }
  
  // Depois, verifica sinônimos
  const synonymMatch = CATEGORIES_CONFIG.find(
    category => category.synonyms.some(
      synonym => synonym.toLowerCase() === normalizedInput
    )
  );
  
  return synonymMatch ? synonymMatch.name : null;
}

export function getCategorySuggestions(input: string): string[] {
  if (!input.trim()) {
    return CATEGORIES_CONFIG.map(cat => cat.name);
  }
  
  const normalizedInput = input.toLowerCase().trim();
  const suggestions: string[] = [];
  
  CATEGORIES_CONFIG.forEach(category => {
    // Verifica se o nome da categoria contém o input
    if (category.name.toLowerCase().includes(normalizedInput)) {
      suggestions.push(category.name);
      return;
    }
    
    // Verifica se algum sinônimo contém o input
    const hasMatchingSynonym = category.synonyms.some(
      synonym => synonym.toLowerCase().includes(normalizedInput)
    );
    
    if (hasMatchingSynonym && !suggestions.includes(category.name)) {
      suggestions.push(category.name);
    }
  });
  
  return suggestions;
}

export function getAllCategories(): string[] {
  return CATEGORIES_CONFIG.map(cat => cat.name);
}
