# One Piece RPG — A Vontade dos Mares (Ficha)

Uma ficha digital de personagem para **One Piece RPG**, com **menu de múltiplas fichas**, **modo escuro**, **importação/exportação em JSON**, **armazenamento local**, e **layout pronto para impressão (A4 paisagem)** — tudo em um único `index.html`.

> ⚠️ Aviso: Este projeto é **não oficial** e **sem fins comerciais**. One Piece é propriedade de seus respectivos detentores de direitos. Veja **[Licença & Fan Content](#licença--fan-content)**.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Recursos](#recursos)
- [Como Usar](#como-usar)
- [Impressão](#impressão)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Modelo de Dados (JSON)](#modelo-de-dados-json)
- [Roadmap / TODO](#roadmap--todo)
- [Contribuindo](#contribuindo)
- [Licença & Fan Content](#licença--fan-content)

---

## Visão Geral

Esta ficha foi pensada para **campanhas persistentes** e **mesas rápidas**. Você pode criar vários personagens, alternar entre eles, duplicar, exportar/baixar a ficha em JSON ou importá-la de volta quando precisar.

---

## Recursos

- **Menu inicial de múltiplas fichas**
  - Criar, jogar, duplicar, exportar e excluir personagens a partir de um **grid de cartões**.
  - Modal de **Import/Export** de personagens.
  - **Compatibilidade/migração automática** de dados antigos para o novo sistema.
- **Sistema por Abas**
  - Abas de **Atributos**, **Habilidades & Fruta**, **Pessoal**, **Itens & Equipamentos**.
- **Modo Escuro (Dark Mode)**
  - Alternância via botão “pílula” acessível tanto no menu quanto dentro da ficha.
- **Armazenamento local (localStorage)**
  - Persistência automática da ficha e listas dinâmicas (competências/aptidões/ataques etc.).
  - Suporte a **múltiplos personagens** em `localStorage`.
- **Importação/Exportação**
  - Exporta a ficha atual (`.json`) e exporta **um personagem específico** a partir do menu.
  - Importa **ficha completa** ou **personagem individual**.
- **Layout pronto para impressão**
  - **A4 landscape**, exibe todas as abas, **oculta controles** (botões, inputs auxiliares) e elementos administrativos ao imprimir.
- **Mobile-friendly**
  - Ajustes responsivos para menu, grid e botões em telas menores.
- **Qualidade de vida**
  - **Voltar ao menu** a partir da ficha para gerenciar personagens.
  - Avatar com **base64/placeholder** para não quebrar a UI.

> Dica: A lógica de cálculo e listas (ex.: **Dano**, **Vigor**, **Ferimentos/Lesões**, **Reservas**, **Habilidades/Akuma no Mi**, **Ataques**) já está preparada na ficha — você só precisa preencher/ajustar conforme seu sistema.

---

## Como Usar

### Local (sem build)
1. **Baixe/clone** este repositório.
2. Abra `index.html` diretamente no navegador **ou** acesse a ficha online em [Ficha-aVdM](https://ficha-de-personagem-op-rpg.vercel.app).
3. Ao abrir, você verá o **menu inicial**:
   - **Criar Novo Personagem** para começar do zero.
   - **Import/Export** para importar um `.json` ou limpar todos os personagens.
   - Clique em **Jogar** para abrir a ficha desse personagem.
4. **Edição & Salvamento**:
   - A ficha salva automaticamente no navegador (**localStorage**).
   - Use **Voltar ao Menu** para voltar ao grid de personagens.
5. **Exportar**:
   - Dentro da ficha: exporte a **ficha atual**.
   - No menu: exporte **um personagem específico** pelos botões do cartão.
6. **Modo Escuro**:
   - Use o botão “Modo Escuro” no menu ou na barra da ficha.

---

## Impressão

- Use **Imprimir** do navegador (Ctrl/Cmd + P).
- Tamanho de papel: **A4**.
- Orientação: **Paisagem**.
- Elementos de UI (botões, inputs auxiliares etc.) são ocultados automaticamente para gerar uma saída limpa.

---

## Estrutura do Projeto

```
.
├─ index.html  # App completo (HTML + CSS + JS)
└─ (opcional) /docs, /assets, etc.
```

> Observação: O projeto está **self-contained** em `index.html`. Futuramente, iremos extrair CSS/JS para arquivos separados.

---

## Modelo de Dados (JSON)

> Exemplo **mínimo** para referência. Os nomes/campos abaixo existem/estão referenciados na ficha e podem variar conforme evolução do projeto.

```json
{
  "nome": "Roronoa Zoro",
  "raca": "Humano",
  "classe": "Lutador",
  "profissao": "Combatente",
  "potencial": "Monstro",
  "nivelClasse": 1,
  "nivelProfissao": 1,

  "akumaSubtipo": "",
  "akumaTematica": "",
  "akumaDesejo": "",

  "listaCompetencias": [],
  "listaItens": [],
  "habilidades": [],
  "frutaHabilidades": [],
  "listaSessoes": [],

  "listaAptidoes": [],
  "listaAtaques": []
}
```

- **Arquivo exportado (ficha atual)**: `fichaOnePiece_<NOME_SANITIZADO>.json`
- **Arquivo exportado (personagem no menu)**: `<NOME_SANITIZADO>.json`

---

## Roadmap / TODO

- [ ] Separar CSS/JS em arquivos externos.
- [ ] Validação de campos e mensagens de erro UX-friendly.
- [ ] Melhorar acessibilidade (foco, contraste, aria-labels).
- [ ] Editor/seleção de avatar com crop e compressão.
- [ ] Templates de personagem (ex.: Marinha/Pirata/Caçador, classes e builds iniciais).
- [ ] Atalhos de teclado e barra de busca rápida.
- [ ] Sistema de versão do schema (migrações mais robustas).
- [ ] Backup/restore em arquivo único (ZIP) com todos os personagens.
- [ ] Sincronização opcional (ex.: Gist/Drive) — avaliar privacidade.
- [ ] Testes automatizados (unitários e e2e).
- [ ] Internacionalização (pt-BR/en-US).

---

## Contribuindo

1. Faça um fork do projeto.
2. Crie uma branch: `feat/minha-melhoria`.
3. Commit/Push e abra um Pull Request descrevendo a mudança.

Sugestões, issues e PRs são muito bem-vindos! 👍

---

## Licença & Fan Content

- **Fan Content**: One Piece é marca/direitos de **Eiichiro Oda / Shueisha / Toei Animation / etc.**  
  Este projeto é **não oficial**, **sem fins lucrativos** e destinado a **fins de fã/educacionais**.  
  **Removeremos** conteúdos mediante solicitação do detentor dos direitos.

---
