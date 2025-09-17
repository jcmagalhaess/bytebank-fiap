// Versão simplificada para teste
export const CATEGORIES = [
  "Alimentação",
  "Transporte", 
  "Lazer",
  "Salário",
  "Educação",
  "Saúde",
  "Moradia",
  "Roupas",
  "Tecnologia",
  "Investimentos",
  "Presentes",
  "Seguros",
  "Impostos",
  "Serviços",
  "Pets",
  "Casa e Jardim"
];

export const SYNONYMS: Record<string, string> = {
  // Transporte
  "combustível": "Transporte",
  "gasolina": "Transporte",
  "álcool": "Transporte",
  "diesel": "Transporte",
  "etanol": "Transporte",
  "uber": "Transporte",
  "taxi": "Transporte",
  "ônibus": "Transporte",
  "metrô": "Transporte",
  "trem": "Transporte",
  "passagem": "Transporte",
  "estacionamento": "Transporte",
  "pedágio": "Transporte",
  "manutenção": "Transporte",
  "pneu": "Transporte",
  "óleo": "Transporte",
  "seguro": "Transporte",
  "ipva": "Transporte",
  "licenciamento": "Transporte",
  "multa": "Transporte",
  "carro": "Transporte",
  "moto": "Transporte",
  "bicicleta": "Transporte",
  "aplicativo": "Transporte",
  "99": "Transporte",
  "cabify": "Transporte",
  "ifood": "Transporte",
  "rappi": "Transporte",
  "iFood": "Transporte",
  
  // Alimentação
  "comida": "Alimentação",
  "restaurante": "Alimentação",
  "supermercado": "Alimentação",
  "mercado": "Alimentação",
  "lanche": "Alimentação",
  "café": "Alimentação",
  "almoço": "Alimentação",
  "jantar": "Alimentação",
  "café da manhã": "Alimentação",
  "desjejum": "Alimentação",
  "delivery": "Alimentação",
  "ifood": "Alimentação",
  "uber eats": "Alimentação",
  "rappi": "Alimentação",
  "iFood": "Alimentação",
  "padaria": "Alimentação",
  "açougue": "Alimentação",
  "feira": "Alimentação",
  "hortifruti": "Alimentação",
  "bebida": "Alimentação",
  "refrigerante": "Alimentação",
  "suco": "Alimentação",
  "água": "Alimentação",
  "cerveja": "Alimentação",
  "vinho": "Alimentação",
  
  // Lazer
  "cinema": "Lazer",
  "teatro": "Lazer",
  "show": "Lazer",
  "festa": "Lazer",
  "balada": "Lazer",
  "bar": "Lazer",
  "viagem": "Lazer",
  "turismo": "Lazer",
  "hotel": "Lazer",
  "pousada": "Lazer",
  "hospedagem": "Lazer",
  "jogo": "Lazer",
  "videogame": "Lazer",
  "streaming": "Lazer",
  "netflix": "Lazer",
  "spotify": "Lazer",
  "academia": "Lazer",
  "esporte": "Lazer",
  "futebol": "Lazer",
  "natação": "Lazer",
  "corrida": "Lazer",
  "disney": "Lazer",
  "amazon prime": "Lazer",
  "hbo": "Lazer",
  "youtube": "Lazer",
  "playstation": "Lazer",
  "xbox": "Lazer",
  "nintendo": "Lazer",
  
  // Salário
  "renda": "Salário",
  "salário": "Salário",
  "proventos": "Salário",
  "pagamento": "Salário",
  "remuneração": "Salário",
  "13º": "Salário",
  "décimo terceiro": "Salário",
  "férias": "Salário",
  "adicional": "Salário",
  "bonus": "Salário",
  "comissão": "Salário",
  "freelance": "Salário",
  "trabalho": "Salário",
  "emprego": "Salário",
  "venda": "Salário",
  "lucro": "Salário",
  "receita": "Salário",
  
  // Educação
  "curso": "Educação",
  "faculdade": "Educação",
  "universidade": "Educação",
  "escola": "Educação",
  "colégio": "Educação",
  "livro": "Educação",
  "material": "Educação",
  "mensalidade": "Educação",
  "matrícula": "Educação",
  "taxa": "Educação",
  "apostila": "Educação",
  "caderno": "Educação",
  "caneta": "Educação",
  "lápis": "Educação",
  "estudo": "Educação",
  "professor": "Educação",
  "aula": "Educação",
  "workshop": "Educação",
  "seminário": "Educação",
  "congresso": "Educação",
  
  // Saúde
  "médico": "Saúde",
  "hospital": "Saúde",
  "clínica": "Saúde",
  "farmácia": "Saúde",
  "remédio": "Saúde",
  "medicamento": "Saúde",
  "consulta": "Saúde",
  "exame": "Saúde",
  "laboratório": "Saúde",
  "dentista": "Saúde",
  "plano": "Saúde",
  "convênio": "Saúde",
  "sus": "Saúde",
  "emergência": "Saúde",
  "ambulância": "Saúde",
  "psicólogo": "Saúde",
  "fisioterapeuta": "Saúde",
  "nutricionista": "Saúde",
  "oftalmologista": "Saúde",
  "cardiologista": "Saúde",
  
  // Moradia
  "aluguel": "Moradia",
  "financiamento": "Moradia",
  "condomínio": "Moradia",
  "iptu": "Moradia",
  "luz": "Moradia",
  "água": "Moradia",
  "gás": "Moradia",
  "internet": "Moradia",
  "telefone": "Moradia",
  "energia elétrica": "Moradia",
  "reforma": "Moradia",
  "construção": "Moradia",
  "móveis": "Moradia",
  "eletrodomésticos": "Moradia",
  "casa": "Moradia",
  "apartamento": "Moradia",
  "imóvel": "Moradia",
  "propriedade": "Moradia",
  "limpeza": "Moradia",
  "jardinagem": "Moradia",
  "pintura": "Moradia",
  
  // Roupas
  "roupa": "Roupas",
  "camisa": "Roupas",
  "calça": "Roupas",
  "vestido": "Roupas",
  "sapato": "Roupas",
  "tênis": "Roupas",
  "bolsa": "Roupas",
  "carteira": "Roupas",
  "relógio": "Roupas",
  "joia": "Roupas",
  "acessório": "Roupas",
  "moda": "Roupas",
  "costura": "Roupas",
  "lavanderia": "Roupas",
  "lavagem": "Roupas",
  
  // Tecnologia
  "celular": "Tecnologia",
  "smartphone": "Tecnologia",
  "computador": "Tecnologia",
  "notebook": "Tecnologia",
  "tablet": "Tecnologia",
  "tv": "Tecnologia",
  "televisão": "Tecnologia",
  "câmera": "Tecnologia",
  "fone": "Tecnologia",
  "headphone": "Tecnologia",
  "mouse": "Tecnologia",
  "teclado": "Tecnologia",
  "monitor": "Tecnologia",
  "impressora": "Tecnologia",
  "software": "Tecnologia",
  "aplicativo": "Tecnologia",
  "app": "Tecnologia",
  
  // Investimentos
  "investimento": "Investimentos",
  "ações": "Investimentos",
  "fundos": "Investimentos",
  "poupança": "Investimentos",
  "cdb": "Investimentos",
  "lci": "Investimentos",
  "lca": "Investimentos",
  "tesouro": "Investimentos",
  "selic": "Investimentos",
  "ipca": "Investimentos",
  "renda fixa": "Investimentos",
  "renda variável": "Investimentos",
  "bolsa": "Investimentos",
  "b3": "Investimentos",
  "corretora": "Investimentos",
  
  // Presentes
  "presente": "Presentes",
  "aniversário": "Presentes",
  "natal": "Presentes",
  "dia das mães": "Presentes",
  "dia dos pais": "Presentes",
  "dia das crianças": "Presentes",
  "valentine": "Presentes",
  "dia dos namorados": "Presentes",
  "casamento": "Presentes",
  "formatura": "Presentes",
  "flores": "Presentes",
  "chocolate": "Presentes",
  
  // Seguros
  "seguro": "Seguros",
  "vida": "Seguros",
  "auto": "Seguros",
  "residencial": "Seguros",
  "saúde": "Seguros",
  "viagem": "Seguros",
  "apólice": "Seguros",
  "premiação": "Seguros",
  "sinistro": "Seguros",
  
  // Impostos
  "imposto": "Impostos",
  "ir": "Impostos",
  "imposto de renda": "Impostos",
  "inss": "Impostos",
  "fgts": "Impostos",
  "pis": "Impostos",
  "cofins": "Impostos",
  "icms": "Impostos",
  "iss": "Impostos",
  "iptu": "Impostos",
  "ipva": "Impostos",
  "taxa": "Impostos",
  "multa": "Impostos",
  
  // Serviços
  "serviço": "Serviços",
  "manutenção": "Serviços",
  "reparo": "Serviços",
  "conserto": "Serviços",
  "instalação": "Serviços",
  "montagem": "Serviços",
  "limpeza": "Serviços",
  "jardinagem": "Serviços",
  "pintura": "Serviços",
  "encanador": "Serviços",
  "eletricista": "Serviços",
  "pedreiro": "Serviços",
  "marceneiro": "Serviços",
  "advogado": "Serviços",
  "contador": "Serviços",
  "consultoria": "Serviços",
  
  // Pets
  "pet": "Pets",
  "cachorro": "Pets",
  "gato": "Pets",
  "veterinário": "Pets",
  "vacina": "Pets",
  "ração": "Pets",
  "brinquedo": "Pets",
  "coleira": "Pets",
  "casinha": "Pets",
  "banho": "Pets",
  "tosa": "Pets",
  "medicamento": "Pets",
  
  // Casa e Jardim
  "jardim": "Casa e Jardim",
  "plantas": "Casa e Jardim",
  "flores": "Casa e Jardim",
  "vaso": "Casa e Jardim",
  "terra": "Casa e Jardim",
  "adubo": "Casa e Jardim",
  "ferramenta": "Casa e Jardim",
  "decoração": "Casa e Jardim",
  "quadro": "Casa e Jardim",
  "cortina": "Casa e Jardim",
  "tapete": "Casa e Jardim",
  "almofada": "Casa e Jardim",
  "luminária": "Casa e Jardim",
  "abajur": "Casa e Jardim"
};

export function findCategoryBySynonym(input: string): string | null {
  const normalizedInput = input.toLowerCase().trim();
  
  // Verifica se é uma categoria exata
  if (CATEGORIES.includes(input)) {
    return input;
  }
  
  // Verifica sinônimos
  return SYNONYMS[normalizedInput] || null;
}

export function getCategorySuggestions(input: string): string[] {
  if (!input.trim()) {
    return CATEGORIES;
  }
  
  const normalizedInput = input.toLowerCase().trim();
  const suggestions: string[] = [];
  
  // Verifica categorias que contêm o input
  CATEGORIES.forEach(category => {
    if (category.toLowerCase().includes(normalizedInput)) {
      suggestions.push(category);
    }
  });
  
  // Verifica sinônimos que contêm o input
  Object.entries(SYNONYMS).forEach(([synonym, category]) => {
    if (synonym.includes(normalizedInput) && !suggestions.includes(category)) {
      suggestions.push(category);
    }
  });
  
  return suggestions;
}

export function getAllCategories(): string[] {
  return CATEGORIES;
}
