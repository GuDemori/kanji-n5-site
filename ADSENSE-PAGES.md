# Kanji N5 - páginas necessárias para AdSense

Este documento define o conteúdo mínimo e os requisitos técnicos para aumentar as chances de aprovação no Google AdSense para este projeto estático.

## Passo 0 (prioridade) - Base de i18n

Antes de publicar páginas institucionais, preparar estrutura de internacionalização para evitar retrabalho de URLs, metadados e conteúdo legal.

Escopo mínimo sugerido:

- Definir idioma padrão (`pt-BR`) e idioma secundário inicial (`en`).
- Centralizar strings de UI em arquivos de tradução.
- Planejar URLs por idioma (ex.: `/pt/about` e `/en/about`, ou estratégia equivalente).
- Garantir consistência entre idioma da interface e idioma das páginas legais.

## Objetivo

Garantir que o site tenha:

- Páginas institucionais rastreáveis
- Conteúdo útil e original
- Transparência legal (privacidade e contato real)
- Estrutura técnica válida para rastreamento do Google

## Estrutura recomendada de URLs

- `/` (ferramenta principal)
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms`
- `/how-to-study-kanji`
- `/kanji-study-guide`

Observação: para site estático, é melhor gerar páginas HTML reais (ex.: `about.html`) e mapear para URLs amigáveis no provedor de hospedagem.

## Requisitos críticos antes de enviar para aprovação

1. Substituir todos os placeholders (`your@email.com`, datas genéricas, texto provisório).
2. Adicionar um e-mail de contato real e funcional.
3. Publicar política de privacidade com data completa (`YYYY-MM-DD`).
4. Criar arquivo `ads.txt` na raiz do domínio.
5. Publicar `robots.txt` e `sitemap.xml`.
6. Garantir navegação visível para páginas institucionais no rodapé.
7. Validar que o domínio é público e acessível sem bloqueios.
8. Ter volume mínimo de conteúdo útil além da tela de estudo principal.

## Definição prática de "volume mínimo de conteúdo útil"

Não existe um número oficial público do AdSense, então o critério deve ser qualitativo + mínimo quantitativo interno.

Referência operacional para este projeto:

- Pelo menos 5 páginas indexáveis além da home.
- Cada página com conteúdo original e objetivo educacional/institucional claro.
- Páginas educativas com texto substancial (evitar páginas muito curtas com poucas linhas).
- Navegação interna entre páginas para facilitar rastreamento.
- Sem conteúdo "placeholder", duplicado ou gerado sem utilidade real.

## Conteúdo base sugerido por página

### `/about`

- Quem criou o projeto e propósito.
- Público-alvo (JLPT N5, iniciantes, autoestudo).
- O que a ferramenta faz hoje.
- Limitações atuais e evolução esperada.

### `/contact`

- E-mail real de contato.
- Prazo médio de resposta (ex.: 3 a 5 dias úteis).
- Canal para reportar erro e sugestões.

### `/privacy-policy`

- Data da última atualização.
- Uso de cookies e tecnologias similares.
- Uso do Google AdSense e fornecedores terceiros.
- Link para configurações de anúncios do Google.
- Como o usuário pode solicitar contato sobre privacidade.
- Declaração sobre venda de dados (ex.: "não vendemos dados pessoais").

Sugestão de link atualizado para preferências de anúncios:

- `https://myadcenter.google.com/`

### `/terms`

- Regras de uso do site.
- Limitação de responsabilidade (conteúdo educacional).
- Aviso de disponibilidade do serviço (sem SLA).
- Forma de atualização dos termos.

### `/how-to-study-kanji`

- Guia prático de estudo em passos curtos.
- Rotina recomendada (tempo diário, revisão, repetição espaçada).
- Erros comuns e como evitar.

### `/kanji-study-guide`

- Conteúdo educativo permanente (não só descrição genérica).
- Explicação de contexto, leitura e vocabulário.
- Boas práticas de retenção e revisão.

## Requisitos técnicos de implementação (site estático)

1. Inserir script do AdSense em `index.html` (após aprovação, ou antes sem blocos agressivos).
2. Não carregar múltiplos scripts AdSense duplicados.
3. Se usar componentes de anúncio, garantir que não quebrem layout mobile.
4. Adicionar metadados mínimos por página:
- `<title>` único
- `<meta name="description">` específico
- `<link rel="canonical">`
5. Garantir que páginas institucionais não dependam de JavaScript para renderização do conteúdo principal.

## Rodapé mínimo recomendado

Incluir links visíveis em todas as páginas:

- About
- Privacy Policy
- Terms
- Contact

Exemplo:

```html
<footer>
  <a href="/about">About</a>
  <a href="/privacy-policy">Privacy Policy</a>
  <a href="/terms">Terms</a>
  <a href="/contact">Contact</a>
</footer>
```

## Checklist de qualidade antes da solicitação

Legenda:

- `[x]` concluído
- `[ ]` pendente
- `[-]` depende de informação externa/publicação

Status de referência: `2026-03-23` (com base no repositório local atual).

### Produto e arquitetura

- [x] Projeto web estático (Vite + Vue) existente e buildável.
- [x] Página principal do produto existe.
- [ ] Páginas institucionais públicas implementadas no build.
- [ ] Estratégia de i18n definida e aplicada nas páginas institucionais.

### Conteúdo e compliance

- [ ] About final com dados reais do responsável.
- [ ] Contact com e-mail real e funcional.
- [ ] Privacy Policy com data completa e texto final sem placeholders.
- [ ] Terms de uso publicados.
- [ ] Conteúdo educativo adicional publicado (`how-to-study-kanji`, `kanji-study-guide`).
- [ ] Conteúdo revisado para consistência de idioma (PT-BR ou EN).

### SEO técnico

- [ ] `robots.txt` na raiz.
- [ ] `sitemap.xml` na raiz.
- [ ] Metadata por página (`title`, `description`, `canonical`).
- [ ] URLs institucionais acessíveis diretamente com status `200`.
- [-] Propriedade validada no Google Search Console.
- [-] Sitemap enviado no Google Search Console.

### AdSense readiness

- [ ] `ads.txt` publicado na raiz do domínio.
- [ ] Script AdSense global adicionado sem duplicidade.
- [ ] Estratégia de posicionamento de anúncios definida sem prejudicar UX.
- [-] Domínio enviado para revisão no AdSense.

## Notas práticas para aprovação

- AdSense não aprova só pela presença de páginas legais; a qualidade global do site pesa.
- O site precisa estar "com cara de projeto real": conteúdo útil, navegação clara, e informações de responsável.
- Evite excesso de blocos de anúncio no início. Priorize conteúdo e experiência primeiro.
