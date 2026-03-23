# Plano de implementação - AdSense no Kanji N5 (passo a passo)

Este plano considera o estado atual do projeto (Vite + Vue SPA) e prioriza aprovação no AdSense com risco baixo.

## Fase 0 - Fundação de i18n (primeiro passo)

1. Definir estratégia de idioma e URL:
- Idioma padrão: `pt-BR`
- Idioma secundário inicial: `en`
- Definir padrão de rota por idioma (`/pt/...` e `/en/...`) ou alternativa equivalente

2. Extrair textos fixos da interface para dicionários de tradução.

3. Garantir que páginas legais e metadados também usem estrutura de idioma.

Critério de aceite da fase:
- Navegação e páginas institucionais preparadas para múltiplos idiomas sem duplicação manual desorganizada.

## Fase 1 - Preparação de conteúdo e conformidade

1. Definir dados reais do responsável:
- Nome (ou marca)
- E-mail de contato válido
- Data de atualização das políticas

2. Consolidar textos finais das páginas:
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms`
- `/how-to-study-kanji`
- `/kanji-study-guide`

3. Revisar linguagem para consistência:
- Manter todo o conteúdo em PT-BR (ou todo em inglês)
- Remover placeholders e texto genérico

Critério de aceite da fase:
- Nenhuma página com dado fictício.

## Fase 2 - Estrutura técnica de páginas estáticas

4. Implementar páginas HTML estáticas reais (recomendado para rastreamento):
- Criar arquivos em `public/` ou como entradas HTML do Vite.
- Garantir que cada página tenha conteúdo renderizado sem depender de JS.

5. Definir URLs amigáveis no host:
- Mapear `about.html -> /about`
- Mapear `privacy-policy.html -> /privacy-policy`
- Repetir para as demais páginas

6. Adicionar navegação global:
- Rodapé com links para About, Privacy Policy, Terms e Contact
- Rodapé presente na home e nas páginas institucionais

Critério de aceite da fase:
- Todas as páginas abrem diretamente por URL, com status `200`.

## Fase 3 - SEO técnico mínimo

7. Em cada página institucional, incluir:
- `<title>` único
- `<meta name="description">`
- `<link rel="canonical">`
- `<meta name="robots" content="index,follow">`

8. Criar `public/robots.txt`:
- Permitir rastreamento
- Informar URL do sitemap

9. Gerar `public/sitemap.xml` com todas as URLs públicas.

Critério de aceite da fase:
- Robots e sitemap acessíveis na raiz do domínio.

## Fase 4 - AdSense readiness

10. Criar `public/ads.txt` com a linha fornecida pelo AdSense.

11. Inserir script do AdSense no `index.html`:
- Script `async`
- Apenas uma inclusão global

12. (Opcional na pré-aprovação) Não exibir blocos de anúncio ainda:
- Deixar só script global até confirmação da conta/site

Critério de aceite da fase:
- `ads.txt` válido e script presente sem duplicidade.

## Fase 5 - Publicação e validação

13. Fazer build e validar localmente:
- `npm run build`
- `npm run preview`
- Testar todas as URLs institucionais

14. Publicar no domínio final (não temporário).

15. Validar propriedade no Google Search Console:
- Enviar `sitemap.xml`
- Solicitar indexação das páginas principais

16. Solicitar revisão no AdSense para o domínio.

Critério de aceite da fase:
- Site publicado, rastreável e com solicitação enviada.

## Fase 6 - Pós-aprovação

17. Criar posições de anúncios com baixa densidade:
- 1 bloco no topo do conteúdo ou entre seções
- 1 bloco no final da página

18. Monitorar métricas por 2 semanas:
- Core Web Vitals
- Taxa de rejeição
- Erros de política no AdSense

19. Ajustar posicionamento de anúncios sem prejudicar UX.

Critério de aceite da fase:
- Anúncios ativos sem queda perceptível de experiência.

## Tarefas técnicas sugeridas para este repositório

1. Criar diretório `public/pages/` (ou estratégia equivalente) para páginas institucionais.
2. Adicionar componente de rodapé reutilizável na SPA (`src/components/SiteFooter.vue`) e usar no `App.vue`.
3. Adicionar `public/robots.txt`, `public/sitemap.xml` e `public/ads.txt`.
4. Atualizar `index.html` com metatags e ponto único para script AdSense.
5. Documentar no `README.md` como manter páginas institucionais e arquivos de SEO.

## Riscos e mitigação

- Risco: reprovação por “conteúdo insuficiente”.
Mitigação: expandir páginas educativas com conteúdo original e útil.

- Risco: páginas institucionais não rastreadas por serem apenas rotas SPA.
Mitigação: gerar HTML estático real por URL.

- Risco: política de privacidade incompleta.
Mitigação: revisar com checklist legal básico antes de publicar.

## Checklist robusto de execução (status atual)

Legenda:

- `[x]` concluído
- `[ ]` pendente
- `[-]` depende de publicação/plataforma externa

Status de referência: `2026-03-23`.

### Fase 0 - i18n

- [ ] Estratégia de URL por idioma definida.
- [ ] Infra de traduções implementada.
- [ ] Textos da UI extraídos para dicionário.
- [ ] Páginas institucionais preparadas para locale.

### Fase 1 - Conteúdo

- [ ] Dados reais de responsável definidos.
- [ ] About final revisada.
- [ ] Contact final revisada.
- [ ] Privacy Policy final revisada.
- [ ] Terms final revisada.
- [ ] Guias educativos finais revisados.

### Fase 2 - Estrutura estática

- [ ] Páginas institucionais em HTML estático no build.
- [ ] URLs amigáveis mapeadas no host.
- [ ] Rodapé global com links institucionais em todas as telas.

### Fase 3 - SEO técnico

- [ ] `robots.txt` criado.
- [ ] `sitemap.xml` criado.
- [ ] Metadados por página criados.
- [ ] Validação local de status `200` em todas as páginas.

### Fase 4 - AdSense

- [ ] `ads.txt` criado com ID de publisher correto.
- [ ] Script AdSense inserido sem duplicidade.
- [ ] Estratégia inicial de blocos definida (baixa densidade).

### Fase 5 - Publicação

- [x] Pipeline de build/test no CI já existe.
- [ ] Build local final validado com páginas institucionais.
- [-] Domínio final publicado.
- [-] Search Console validado.
- [-] Sitemap enviado ao Search Console.
- [-] Solicitação de revisão enviada no AdSense.

### Fase 6 - Pós-aprovação

- [ ] Blocos ativados com acompanhamento de UX.
- [ ] Monitoramento de Core Web Vitals por 2 semanas.
- [ ] Ajustes de posicionamento com base em dados reais.
