# Kanji N5 - treino de identificação

Aplicação web para praticar reconhecimento de kanji do **JLPT N5**, agora migrada para **Vue 3 + Pinia + Tailwind + Vite**.

## Funcionalidades

- Modo **Flashcards**
- Modo **Quiz** com múltipla escolha
- Busca e filtro por status na lista completa
- Persistência de progresso e sessão no `localStorage`
- Métricas de sessão (tentativas, acertos, taxa, streak)
- Atalhos de teclado

## Stack

- Vue 3
- Pinia
- Tailwind CSS 4
- Vite

## Como executar

1. Instale dependências:

```bash
npm install
```

2. Rode em desenvolvimento:

```bash
npm run dev
```

3. Build de produção:

```bash
npm run build
```

4. Pré-visualização da build:

```bash
npm run preview
```

## Atalhos de teclado

- `←` / `→`: voltar/avançar cards
- `1` a `4`: responder no modo Quiz
- `Enter`: próxima pergunta (após responder no Quiz)
- `Esc`: fechar tooltip de ajuda

## Estrutura

- `src/App.vue`: UI principal
- `src/stores/useStudyStore.js`: estado e regras de negócio
- `src/data/kanjiData.js`: base de kanji
- `src/style.css`: Tailwind + estilos auxiliares
- `src/main.js`: bootstrap da aplicação

## Persistência

A aplicação usa `localStorage` com as chaves:

- `kanji-n5-progress-v1`
- `kanji-n5-session-v1`

