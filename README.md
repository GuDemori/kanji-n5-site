# Kanji N5 - treino de identificação

Aplicação web para praticar reconhecimento de kanji do **JLPT N5**, migrada para **Vue 3 + Pinia + Tailwind + Vite**.

## Funcionalidades

- Modo **Flashcards** com validação de leitura
- Conversão automática de escrita para hiragana (via `wanakana`)
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
- Vitest
- WanaKana

## Como rodar

1. Instale dependências:

```bash
npm install
```

2. Rode em desenvolvimento:

```bash
npm run dev
```

3. Gere build de produção:

```bash
npm run build
```

4. Pré-visualize a build:

```bash
npm run preview
```

## Testes

- Rodar testes uma vez:

```bash
npm test
```

- Rodar em modo watch:

```bash
npm run test:watch
```

## Docker

### Produção (Nginx + build estática)

Executar com Docker Compose:

```bash
docker compose up --build -d
```

Ou com Makefile (atalho recomendado):

```bash
make up
```

Aplicação disponível em:

```text
http://localhost:90
```

Parar container:

```bash
docker compose down
```

Com Makefile:

```bash
make down
```

Build e execução sem Compose:

```bash
docker build -t kanji-n5-site .
docker run --rm -p 90:80 kanji-n5-site
```

Atalhos adicionais com Makefile:

```bash
make ps
make logs
make restart
make rebuild
```

### Desenvolvimento com hot reload (recomendado para codar)

Subir uma única vez:

```bash
make dev
```

Abrir:

```text
http://localhost:5173
```

Depois, ao editar arquivos em `src/`, a página atualiza sem `make down/up`.

Comandos úteis:

```bash
make dev-logs
make dev-ps
make dev-down
```

## Atalhos de teclado

- `←` / `→`: voltar/avançar cards
- `1` a `4`: responder no modo Quiz
- `Enter`: próxima pergunta (após responder no Quiz)
- `Esc`: fechar tooltip de ajuda

## Estrutura

- `src/App.vue`: UI principal
- `src/stores/useStudyStore.js`: estado e regras de negócio
- `src/stores/useStudyStore.reading.test.js`: testes do fluxo de leitura
- `src/stores/useStudyStore.quiz.test.js`: testes do fluxo de quiz
- `src/stores/useStudyStore.state.test.js`: testes de estado/persistência
- `src/stores/useStudyStore.test.helpers.js`: helpers da suíte de testes
- `src/data/kanjiData.js`: base de kanji
- `src/style.css`: Tailwind + estilos auxiliares
- `src/main.js`: bootstrap da aplicação

## Persistência

A aplicação usa `localStorage` com as chaves:

- `kanji-n5-progress-v1`
- `kanji-n5-session-v1`
