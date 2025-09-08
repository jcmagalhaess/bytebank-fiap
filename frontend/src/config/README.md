# Sistema de Categorias Inteligente

## Visão Geral

Este sistema implementa um campo de categoria inteligente que:

1. **Impede categorias inválidas**: O usuário não pode criar categorias que não existem
2. **Suporte a sinônimos**: Permite que o usuário digite sinônimos que são automaticamente convertidos para a categoria oficial
3. **Sugestões inteligentes**: Mostra sugestões baseadas no que o usuário está digitando

## Como Funciona

### Categorias Disponíveis

- **Alimentação**: comida, restaurante, supermercado, lanche, café, etc.
- **Transporte**: combustível, gasolina, uber, taxi, ônibus, etc.
- **Lazer**: cinema, teatro, viagem, streaming, academia, etc.
- **Salário**: renda, proventos, 13º, férias, comissão, etc.
- **Educação**: curso, faculdade, livro, mensalidade, etc.
- **Saúde**: médico, hospital, farmácia, remédio, etc.
- **Moradia**: aluguel, condomínio, luz, água, reforma, etc.

### Exemplos de Uso

- Usuário digita "combustível" → Sistema sugere "Transporte"
- Usuário digita "comida" → Sistema sugere "Alimentação"
- Usuário digita "gasolina" → Sistema sugere "Transporte"
- Usuário digita "ifood" → Sistema sugere "Alimentação"

### Validação

- Se o usuário digitar algo que não é uma categoria válida nem um sinônimo, o sistema mostra erro
- O sistema converte automaticamente sinônimos para a categoria oficial ao salvar
- Sugestões aparecem em tempo real conforme o usuário digita

## Arquivos Modificados

- `categories.ts`: Configuração das categorias e sinônimos
- `NewTransactionForm.tsx`: Formulário de nova transação com sistema inteligente
- `EditTransactionModal.tsx`: Modal de edição com sistema inteligente
