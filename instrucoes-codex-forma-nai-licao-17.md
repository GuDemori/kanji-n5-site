# Instruções para o Codex — Adicionar forma ない na aba de verbos

## Objetivo

Na aba já existente **Verbos**, adicionar suporte à prática da **forma ない**, mantendo a prática atual da **forma て** funcionando exatamente como já funciona hoje.

A alteração deve seguir os padrões visuais, estruturais e de dados já existentes no sistema.

A página atual já possui:

- prática de forma て;
- tradução;
- inversão de tradução;
- filtro por lição;
- lista completa de verbos;
- regras da forma て;
- estatísticas de tentativa, acertos, taxa, streak e melhor streak.

Agora, o sistema deve permitir alternar entre:

- Forma て
- Forma ない

---

## Escopo principal

### 1. Adicionar seletor de tipo de prática

Adicionar um select de **Tipo de prática** dentro do card de controles da prática, no mesmo bloco onde hoje ficam:

- Filtrar prática por lição
- Responder forma て
- Responder tradução
- Inverter tradução

O select deve aparecer antes dos toggles de resposta, preferencialmente na primeira posição do bloco de controles.

Layout sugerido:

```txt
Linha 1:
- Tipo de prática: [Forma て / Forma ない]
- Filtrar prática por lição: [Todas as lições]

Linha 2:
- Responder conjugação
- Responder tradução
- Inverter tradução
```

Evitar colocar esse select solto logo abaixo do subtítulo da página, porque ele é uma configuração funcional da prática, não uma informação introdutória.

Comportamento esperado:

- Quando estiver selecionado **Forma て**, manter tudo como já está hoje.
- Quando estiver selecionado **Forma ない**, o exercício deve pedir a forma ない do verbo.
- O texto dos inputs, títulos, cards e regras deve se adaptar ao tipo selecionado.

Exemplo:

Quando estiver em forma て:

- Card: `VERBO BASE`
- Input: `Forma て`
- Placeholder: `Digite a forma て`
- Seção de regras: `Regras da forma て`

Quando estiver em forma ない:

- Card: `VERBO BASE`
- Input: `Forma ない`
- Placeholder: `Digite a forma ない`
- Seção de regras: `Regras da forma ない`

---

## 2. Não quebrar a prática atual da forma て

A prática de forma て deve continuar funcionando como está.

Não alterar desnecessariamente:

- layout geral;
- estatísticas;
- funcionamento de streak;
- filtros por lição;
- prática de tradução;
- inversão de tradução;
- lista completa;
- dados já cadastrados das lições 14, 15 e 16.

A implementação deve ser incremental.

---

## 3. Atualizar estrutura dos verbos

Hoje os verbos parecem seguir uma estrutura parecida com:

```ts
{
  lesson: 14,
  base: 'つけます',
  te: 'つけて',
  translation: 'acender, ligar',
  group: 2
}
```

Adicionar um novo campo para a forma ない:

```ts
{
  lesson: 17,
  base: 'おぼえます',
  te: 'おぼえて',
  nai: 'おぼえない',
  translation: 'memorizar',
  group: 2
}
```

Caso a estrutura real seja diferente, adaptar mantendo o padrão atual do projeto.

---

## 4. Verbos novos da lição 17

Adicionar os seguintes verbos na lista da aba **Verbos**.

Todos devem ter:

- verbo base;
- forma て;
- forma ない;
- tradução;
- lição 17;
- grupo verbal, caso o projeto já use essa informação.

### Lista de verbos

```ts
[
  {
    lesson: 17,
    base: 'おぼえます',
    te: 'おぼえて',
    nai: 'おぼえない',
    translation: 'memorizar',
    group: 2
  },
  {
    lesson: 17,
    base: 'わすれます',
    te: 'わすれて',
    nai: 'わすれない',
    translation: 'esquecer',
    group: 2
  },
  {
    lesson: 17,
    base: 'なくします',
    te: 'なくして',
    nai: 'なくさない',
    translation: 'perder',
    group: 1
  },
  {
    lesson: 17,
    base: 'はらいます',
    te: 'はらって',
    nai: 'はらわない',
    translation: 'pagar',
    group: 1
  },
  {
    lesson: 17,
    base: 'かえします',
    te: 'かえして',
    nai: 'かえさない',
    translation: 'devolver',
    group: 1
  },
  {
    lesson: 17,
    base: 'でかけます',
    te: 'でかけて',
    nai: 'でかけない',
    translation: 'sair',
    group: 2
  },
  {
    lesson: 17,
    base: 'ぬぎます',
    te: 'ぬいで',
    nai: 'ぬがない',
    translation: 'tirar roupa ou sapato',
    group: 1
  },
  {
    lesson: 17,
    base: 'もっていきます',
    te: 'もっていって',
    nai: 'もっていかない',
    translation: 'levar alguma coisa',
    group: 1
  },
  {
    lesson: 17,
    base: 'もってきます',
    te: 'もってきて',
    nai: 'もってこない',
    translation: 'trazer alguma coisa',
    group: 3
  },
  {
    lesson: 17,
    base: 'しんぱいします',
    te: 'しんぱいして',
    nai: 'しんぱいしない',
    translation: 'preocupar-se',
    group: 3
  },
  {
    lesson: 17,
    base: 'ざんぎょうします',
    te: 'ざんぎょうして',
    nai: 'ざんぎょうしない',
    translation: 'fazer hora extra',
    group: 3
  },
  {
    lesson: 17,
    base: 'しゅっちょうします',
    te: 'しゅっちょうして',
    nai: 'しゅっちょうしない',
    translation: 'viajar a trabalho',
    group: 3
  },
  {
    lesson: 17,
    base: 'のみます',
    te: 'のんで',
    nai: 'のまない',
    translation: 'tomar remédio',
    group: 1
  },
  {
    lesson: 17,
    base: 'はいります',
    te: 'はいって',
    nai: 'はいらない',
    translation: 'entrar; tomar banho quando usado com おふろに',
    group: 1
  }
]
```

Observação importante:

- `なくします` não deve ser tratado como verbo irregular de `します`.
- Ele é grupo I, então fica:
  - `なくします -> なくさない`
  - `なくします -> なくして`

---

## 5. Atualizar filtro por lição

Adicionar **Lição 17** no select de filtro por lição.

A opção deve aparecer nos mesmos locais onde hoje aparecem:

- Todas as lições
- Lição 14
- Lição 15
- Lição 16

Adicionar:

- Lição 17

---

## 6. Atualizar lista completa

Na seção **Lista completa**, os verbos da lição 17 devem aparecer junto dos demais.

Quando o tipo de prática selecionado for **Forma て**, a lista pode continuar exibindo:

```txt
verbo base -> forma て -> tradução
```

Quando o tipo de prática selecionado for **Forma ない**, a lista deve exibir:

```txt
verbo base -> forma ない -> tradução
```

Exemplo:

```txt
おぼえます -> おぼえない -> memorizar
```

Se for mais simples e mais consistente com o projeto, também pode exibir as duas formas:

```txt
おぼえます -> おぼえて / おぼえない -> memorizar
```

Mas a melhor opção para UX é mudar dinamicamente conforme o tipo de prática selecionado.

---

## 7. Regras da forma ない

Adicionar uma seção dinâmica de regras.

Quando o usuário selecionar **Forma て**, mostrar as regras atuais da forma て.

Quando selecionar **Forma ない**, mostrar as regras abaixo.

Título:

```txt
Regras da forma ない
```

Conteúdo:

### Grupo I

Regra geral:

```txt
Troca o som antes de ます para a coluna あ e adiciona ない.
```

Exemplos:

```txt
かきます -> かかない
いそぎます -> いそがない
のみます -> のまない
とります -> とらない
あそびます -> あそばない
まちます -> またない
はなします -> はなさない
```

Atenção especial para verbos terminados em `います`:

```txt
かいます -> かわない
はらいます -> はらわない
```

Não usar:

```txt
かあない
はらあない
```

### Grupo II

Regra:

```txt
Remove ます e adiciona ない.
```

Exemplos:

```txt
たべます -> たべない
みます -> みない
おきます -> おきない
でかけます -> でかけない
わすれます -> わすれない
```

### Grupo III

Verbos irregulares:

```txt
します -> しない
きます -> こない
```

Verbos compostos com `します`:

```txt
べんきょうします -> べんきょうしない
しんぱいします -> しんぱいしない
ざんぎょうします -> ざんぎょうしない
しゅっちょうします -> しゅっちょうしない
```

Verbo composto com `きます`:

```txt
もってきます -> もってこない
```

---

## 8. Usos da forma ない

Adicionar uma seção abaixo das regras da forma ない, semelhante à seção atual de usos da forma て.

Título:

```txt
Usos da forma ない
```

Cards sugeridos:

### 1. Pedido negativo / proibição educada

```txt
V forma ない + でください

しゃしんを とらないでください。
Por favor, não tire fotos.
```

### 2. Obrigação

```txt
V forma ない sem い + ければなりません

くすりを のまなければなりません。
Tenho que tomar remédio.
```

Atenção para explicar visualmente:

```txt
のまない -> のまなければなりません
```

### 3. Não é necessário fazer

```txt
V forma ない sem い + くてもいいです

あした こなくてもいいです。
Não precisa vir amanhã.
```

Atenção para explicar visualmente:

```txt
こない -> こなくてもいいです
```

---

## 9. Ajustes no funcionamento da prática

Criar um estado para controlar o tipo de prática.

Sugestão:

```ts
const [conjugationType, setConjugationType] = useState<'te' | 'nai'>('te')
```

Ou equivalente, conforme o padrão atual do projeto.

Ao verificar resposta:

- Se `conjugationType === 'te'`, comparar com o campo `te`.
- Se `conjugationType === 'nai'`, comparar com o campo `nai`.

Não duplicar lógica desnecessariamente.

Criar uma função auxiliar, se fizer sentido:

```ts
function getExpectedConjugation(verb, conjugationType) {
  if (conjugationType === 'te') return verb.te
  if (conjugationType === 'nai') return verb.nai
}
```

Também ajustar labels dinamicamente:

```ts
const conjugationLabel = conjugationType === 'te' ? 'Forma て' : 'Forma ない'
```

---

## 10. Normalização de respostas

Manter a normalização atual, caso exista.

A resposta deve aceitar pelo menos:

- espaços acidentais no começo/fim;
- diferença irrelevante entre espaços internos;
- entrada em hiragana exatamente como cadastrada.

Não precisa adicionar romanização.

Exemplo:

```txt
おぼえない
```

deve ser aceito.

Não aceitar respostas parcialmente corretas como corretas.

---

## 11. Ajustes de UI/UX com base nas imagens

A interface atual está visualmente boa: dark mode consistente, cards bem separados, boa hierarquia visual e botões claros.

Mesmo assim, ao adicionar a nova funcionalidade, considerar os pontos abaixo.

### 11.1. Agrupar controles por função

O select de **Tipo de prática** deve ficar dentro do card de controles, não solto no topo da página.

Esse bloco já é entendido visualmente como a área onde o usuário configura o exercício.

Boa ordem sugerida:

1. Tipo de prática
2. Filtro por lição
3. Toggles de resposta

### 11.2. Evitar excesso de controles na mesma linha

Hoje já existem:

- filtro por lição;
- responder forma て;
- responder tradução;
- inverter tradução.

Ao adicionar o select de tipo de prática, não colocar tudo espremido na mesma linha.

Sugestão:

- Linha 1: selects principais.
- Linha 2: toggles.

### 11.3. Atualizar texto do subtítulo

Texto atual:

```txt
Treine forma て, tradução, ou inverta para responder o verbo em japonês.
```

Sugestão após adicionar forma ない:

```txt
Treine conjugações, tradução, ou inverta para responder o verbo em japonês.
```

Ou:

```txt
Treine forma て, forma ない, tradução, ou inverta para responder o verbo em japonês.
```

A primeira opção é mais limpa.

### 11.4. Labels dinâmicas

Quando estiver em forma ない, não deixar nenhum texto falando forma て dentro da área principal de prática.

Exemplo ruim:

```txt
Responder forma て
Digite a forma て
```

quando o usuário selecionou forma ない.

Exemplo correto:

```txt
Responder forma ない
Digite a forma ない
```

### 11.5. Regras dinâmicas

Evitar mostrar regras da forma て e forma ない uma embaixo da outra por padrão.

Isso deixaria a página muito longa.

Melhor comportamento:

- se selecionado forma て, mostrar regras da forma て;
- se selecionado forma ない, mostrar regras da forma ない.

Se quiser manter ambas acessíveis, usar accordion ou tabs, mas não duplicar conteúdo visível o tempo todo.

### 11.6. Responsividade

Garantir que no mobile:

- o select de tipo de prática ocupe largura total;
- os toggles quebrem linha sem esmagar texto;
- os cards de regras fiquem em uma coluna;
- a lista completa continue legível.

### 11.7. Acessibilidade

Garantir:

- label real para o select de tipo de prática;
- foco visível;
- toggles acessíveis via teclado;
- botões com texto claro;
- inputs com label associado.

---

## 12. Critérios de aceite

A tarefa só estará completa quando:

- A aba **Verbos** continuar funcionando com a forma て.
- Existir um select para alternar entre forma て e forma ない.
- O select estiver dentro do card de controles da prática, junto dos filtros/toggles.
- A prática de forma ない funcionar corretamente.
- Os verbos da lição 17 estiverem cadastrados.
- O filtro por lição exibir **Lição 17**.
- A lista completa exibir os verbos da lição 17.
- As regras da forma ない aparecerem quando essa prática estiver selecionada.
- Os textos da interface mudarem dinamicamente entre forma て e forma ない.
- Não houver regressão na prática de tradução e inversão de tradução.
- A página continuar responsiva.
- A implementação seguir os padrões já existentes do projeto.

---

## 13. Casos de teste manuais

Testar pelo menos os fluxos abaixo.

### Forma て existente

1. Selecionar tipo de prática `Forma て`.
2. Receber verbo `おきます`.
3. Responder `おきて`.
4. Deve marcar como correto.

### Forma ない grupo I

1. Selecionar tipo de prática `Forma ない`.
2. Receber verbo `はらいます`.
3. Responder `はらわない`.
4. Deve marcar como correto.

### Forma ない grupo II

1. Selecionar tipo de prática `Forma ない`.
2. Receber verbo `おぼえます`.
3. Responder `おぼえない`.
4. Deve marcar como correto.

### Forma ない grupo III com します

1. Selecionar tipo de prática `Forma ない`.
2. Receber verbo `しんぱいします`.
3. Responder `しんぱいしない`.
4. Deve marcar como correto.

### Forma ない com きます

1. Selecionar tipo de prática `Forma ない`.
2. Receber verbo `もってきます`.
3. Responder `もってこない`.
4. Deve marcar como correto.

### Resposta errada

1. Selecionar tipo de prática `Forma ない`.
2. Receber verbo `はらいます`.
3. Responder `はらあない`.
4. Deve marcar como incorreto.

### Filtro por lição

1. Selecionar `Lição 17`.
2. Confirmar que aparecem apenas verbos da lição 17.
3. Alternar entre forma て e forma ない.
4. Confirmar que os mesmos verbos continuam filtrados, mudando apenas a forma cobrada.

---

## 14. Fora de escopo

Não adicionar ainda:

- prática de `ないでください`;
- prática de `なければなりません`;
- prática de `なくてもいいです`;
- vocabulário não verbal em outra aba;
- romanização;
- áudio;
- sistema de revisão espaçada.

Nesta tarefa, essas estruturas devem aparecer apenas como explicação nas regras/usos da forma ない.
