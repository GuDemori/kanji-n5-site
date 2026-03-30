# AGENTS.md

## Objetivo
Manter e evoluir o site de treino de kanji N5 com arquitetura Vue.

## Regras de trabalho
- Responder em português-BR.
- Fazer mudanças pequenas e objetivas.
- Preservar comportamento de `flashcard`, `quiz`, busca/filtro e persistência em `localStorage`.
- Manter compatibilidade mobile.
- Escrever ou atualizar testes Vitest para alterações relevantes.
- Rodar os testes após mudanças relevantes.
- Atualizar `README.md` quando houver mudança de stack, comandos ou fluxo principal.

## Padrões técnicos
- Stack principal: Vue 3 + Pinia + Tailwind + Vite.
- Evitar dependências novas sem necessidade.
- Centralizar regra de negócio no store (`src/stores/useStudyStore.js`).
- Evitar comentários óbvios no código.

## Verificação
- Rodar `npm run build` após mudanças relevantes.
- Rodar `npm test` quando houver alteração de regra de negócio.
- Verificar manualmente os fluxos: `flashcard`, `quiz`, atalhos de teclado e filtros da lista.
