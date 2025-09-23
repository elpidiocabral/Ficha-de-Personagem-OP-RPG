# A Vontade dos Mares — Frontend da Ficha de Personagem

Frontend **puro (HTML/CSS/JS)** da ficha dinâmica do sistema de RPG *A Vontade dos Mares* (inspirado em One Piece).  
Focado em **criar/editar várias fichas**, **salvar no navegador**, **importar/exportar JSON** e **imprimir em A4 paisagem**. Não há build nem dependências — é abrir e usar.

> ⚠️ **Fan content / não-oficial** — ver seção [Licença & Fan Content](#licença--fan-content).

---

## Sumário
- [Visão Geral](#visão-geral)
- [Stack & Requisitos](#stack--requisitos)
- [Como Rodar](#como-rodar)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Persistência & Modelo de Dados](#persistência--modelo-de-dados)
- [Impressão (PDF/A4)](#impressão-pdfa4)
- [Pontos de Extensão (futuro backend/login)](#pontos-de-extensão-futuro-backendlogin)
- [Boas Práticas de Código](#boas-práticas-de-código)
- [Roadmap do Front](#roadmap-do-front)
- [Licença & Fan Content](#licença--fan-content)

---

## Visão Geral

- **UI em abas**: *Atributos*, *Habilidades & Fruta*, *Pessoal* e *Itens & Equipamentos*.
- **Múltiplas fichas**: menu inicial com grid de personagens (criar, jogar, duplicar, exportar, excluir, importar).
- **Modo escuro**: alternância persistida (localStorage).
- **Cálculos automáticos**: atributos derivados, barras de Vida/Vigor com penalidades e reservas por “dados”.
- **Listas dinâmicas**: ataques, habilidades (comuns e da Fruta), itens/equipamentos, competências/aptidões/trunfos.
- **Import/Export**: JSON da ficha atual ou de um personagem no menu.
- **Impressão limpa**: CSS específico para A4 paisagem, escondendo controles/inputs irrelevantes.

---

## Stack & Requisitos

- **Sem build**: HTML + CSS + JavaScript vanilla.
- **Navegadores suportados**: modernos (Chromium/Firefox/Edge).  
- **Sem dependências externas** por enquanto.

> Dica: para testar *Importar JSON* com segurança, prefira rodar com um servidor estático local (ex.: `npx serve .` ou `python -m http.server 5173`).

---

## Como Rodar

### Opção 1 — Abrir direto
1. Baixe/clon​e o repositório.
2. Abra **`index.html`** no navegador.

### Opção 2 — Servidor estático (recomendado)
```bash
# Node
npx serve .
# ou Python
python -m http.server 5173
```
Acesse: http://localhost:5173 (ou porta exibida).

---

## Funcionalidades

- **Menu de Personagens**
  - Criar novo, Jogar, Duplicar, Exportar `.json`, Excluir.
  - Importar personagem (arquivo `.json` individual).
  - Limpar *todos* os personagens.
- **Ficha**
  - Salvar no navegador, Exportar/Importar `.json`, Imprimir em A4, Limpar dados.
  - Avatar em base64 (placeholder por padrão).
  - Atributos principais e derivados com cálculo automático.
  - Vida e Vigor com barras e penalidades visuais.
  - Ferimentos/Lesões, Reservas (Vida/Vigor), CA/CD/Det./Sorte/Desloc.
  - Habilidades (comuns) e Habilidades da **Fruta** (tipo, subtipo, temática, desejo, nível).
  - Ataques, Itens/Equipamentos (com durabilidade/uso e +/−), Competências/Aptidões/Trunfos.
  - Campos pessoais (história, sonho, reputação, moral etc.).
- **Tema**
  - Alternância *Modo Escuro* persistida.

---

## Estrutura do Projeto

```
.
├─ index.html     # Estrutura da UI (menu, abas, formulários)
├─ styles.css     # Estilos gerais + regras de impressão (@media print)
└─ scripts.js     # Lógica: abas, persistência, listas dinâmicas, cálculos, menu
```

Principais blocos em `scripts.js`:
- **Sistema de Abas** (`configurarAbas`)
- **Tema Dark/Light** (`alternarTema`; key `temaRPG`)
- **Atributos & Cálculos** (`atualizarAtributos`, `atualizarBarrasStatus`, `calcularReservas`)
- **Listas Dinâmicas** (ataques, itens, habilidades comuns/Fruta, competências/aptidões/trunfos)
- **Import/Export** (`exportarJSON`, `importarJSON` e `importarPersonagem`)
- **Múltiplas Fichas** (“menu inicial”: `carregarPersonagens`, `salvarPersonagem`, `criarNovoPersonagem`, `duplicarPersonagem`, `excluirPersonagem`, `mostrarFicha`, `voltarParaMenu`)
- **Persistência** (`coletarDados`, `carregarFicha`, `salvarFicha`, `carregarDoLocalStorage`)

---

## Persistência & Modelo de Dados

### Onde salva
- **localStorage** (chaves):
  - `personagensOnePiece` → dicionário de personagens (id → objeto da ficha)
  - `fichaOnePiece` → último snapshot da ficha carregada/aberta
  - `ataques` → lista independente de ataques (compatibilidade)
  - `competencia`, `aptidao` → listas independentes (compatibilidade)
  - `temaRPG` → “escuro” ou “claro”

> Observação: o sistema de **múltiplas fichas** usa `personagensOnePiece`. As chaves individuais (`ataques`, `competencia`, `aptidao`) existem por **retrocompatibilidade** e serão consolidadas na ficha (objeto principal) no futuro.

### Formato de ficha (resumo)
A ficha é um **objeto JSON** com campos como:
```json
{
  "nome": "Exemplo",
  "raca": "Humano",
  "classe": "Lutador",
  "profissao": "Combatente",
  "potencial": "Monstro",
  "nivelClasse": 1,
  "nivelProfissao": 1,
  "status": { "vida": {}, "vigor": {}, "classeAcerto": "", "classeDificuldade": "" },
  "atributos": { "principais": {}, "derivados": {} },
  "listaAtaques": [],
  "listaItens": [],
  "habilidades": [],
  "frutaHabilidades": [],
  "akumaNome": "", "akumaTipo": "Paramecia", "akumaSubtipo": "", "akumaTematica": "", "akumaDesejo": "",
  "nivelFruta": 0,
  "listaCompetencias": [],
  "listaAptidoes": [],
  "listaTrunfos": [],
  "ferimentos": [], "lesoes": [],
  "reservaVidaQtd": 0, "reservaVigorQtd": 0,
  "pessoal": { "ilhaOrigem": "", "historia": "" },
  "avatarBase64": ""
}
```
> O conteúdo real é coletado por `coletarDados()` e lido por `carregarFicha()` — ver `scripts.js`.

### Import/Export
- **Exportar**: baixa um `.json` com a ficha atual, nomeado como `fichaOnePiece_<NOME>.json`.
- **Importar**: carrega um `.json` e substitui os dados da ficha (ou adiciona um personagem no menu).

---

## Impressão (PDF/A4)

- **Atalho**: `Ctrl/Cmd + P` na ficha aberta.
- **Tamanho**: A4 **paisagem**.
- **CSS de impressão** (`@media print` em `styles.css`):
  - **Mostra todas as abas** automaticamente.
  - **Oculta botões e campos de entrada** que não precisam sair no PDF.
  - **Compacta** os cartões/listas (fonte, espaçamento) para caber melhor.

> Dica: verifique a opção “Cabeçalhos/Rodapés” do navegador se quiser remover URL/data na impressão.

---

## Pontos de Extensão (futuro backend/login)

O frontend já está pronto para **trocar a persistência** sem alterar a UI. Sugestão de *adapter* (arquivo novo `persistencia.ts/js`), com funções assíncronas:
```ts
export async function signInWithDiscord(): Promise<User> {}
export async function loadCharacters(userId: string): Promise<CharacterSummary[]> {}
export async function loadCharacter(userId: string, charId: string): Promise<Character> {}
export async function saveCharacter(userId: string, charId: string, data: Character): Promise<void> {}
export async function deleteCharacter(userId: string, charId: string): Promise<void> {}
```
- Implementação inicial: localStorage (já existente).
- Implementação futura: Firestore/MongoDB (NoSQL) usando o mesmo contrato.

> Quando o backend estiver disponível, basta **trocar a importação** do adapter para migrar de localStorage → API sem refatorar a UI.

---

## Boas Práticas de Código

- **Organização CSS**: manter regras de impressão isoladas em `@media print`.
- **Sem IDs mágicos**: usar constantes para chaves de `localStorage`.
- **Inputs numéricos**: validar e normalizar (`Number.parseInt(... ) || 0`).
- **Debounce de salvamento** (se necessário): evitar gravar a cada tecla (útil quando migrar para API).
- **Acessibilidade**: labels associados, foco visível, contraste suficiente, textos alternativos para avatar.

---

## Roadmap do Front

- [ ] Unificar listas legadas (`ataques`, `competencia`, `aptidao`) dentro do objeto da ficha.
- [ ] “Adapter de persistência” para alternar localStorage ↔ API.
- [ ] Pré-visualização de impressão.
- [ ] Editor de avatar com *crop* e compressão, salvando somente URL (quando houver storage).
- [ ] Comandos de teclado (adicionar item/ataque/skill rápido).
- [ ] Templates/Presets de personagem.
- [ ] Testes unitários de cálculos e e2e básicos (Playwright).

---

## Licença & Fan Content

- **Uso de marca/personagens**: conteúdo de fã, **sem fins comerciais**.
- Direitos de **Eiichiro Oda / Shueisha / Toei Animation / etc.**
- Remoções mediante solicitação dos detentores.
