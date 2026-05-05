import { ref } from 'vue';

const LOCALE_KEY = 'kanji-n5-locale-v1';
const DEFAULT_LOCALE = 'pt-BR';
const SUPPORTED_LOCALES = ['pt-BR', 'en'];

const messages = {
  'pt-BR': {
    app: {
      flashcards: 'Flashcards',
      quiz: 'Quiz',
      resetProgress: 'Zerar progresso',
      language: 'Idioma',
      kanjiPractice: 'Kanji',
      countingPractice: 'Contagem',
      teFormPractice: 'Verbos',
    },
    header: {
      title: 'Treino de identificação de kanji',
      subtitle: 'Feito com o intuito de praticar o reconhecimento de kanji.',
      helpLabel: 'Mostrar ajuda',
      helpQuiz: '1-4 responde, Enter vai para próxima e Esc fecha feedback.',
      helpNavigation: 'setas esquerda/direita avançam e voltam os cards.',
      helpList: 'use busca e status para filtrar revisão.',
      kanjiCount: 'kanji',
      known: 'sabia',
      unknown: 'não sabia',
    },
    metrics: {
      attempts: 'Tentativas',
      correct: 'Acertos',
      rate: 'Taxa',
      streak: 'Streak',
      bestStreak: 'Melhor streak',
    },
    flashcard: {
      shuffle: 'Embaralhar',
      fullTraining: 'Treino completo',
      reveal: 'Revelar',
      showHint: 'Mostrar dica',
      showAnswer: 'Revelar resposta',
      reading: 'Leitura',
      submitReading: 'Verificar leitura',
      navigation: 'Navegação',
      previous: 'Anterior',
      next: 'Próximo',
      inputHiraganaPlaceholder: 'Digite em romaji ou hiragana',
      inputKatakanaPlaceholder: 'Digite em romaji ou katakana',
      switchToHiragana: 'Trocar conversão automática para hiragana',
      switchToKatakana: 'Trocar conversão automática para katakana',
      fullTrainingStatus: 'Treino completo ativo: {found}/{total} leituras {script} registradas.',
      fullTrainingTotal: 'Total deste kanji (leituras kun + on): {found}/{total}.',
      scriptKun: 'kun (hiragana)',
      scriptOn: 'on (katakana)',
      acceptedReadings: 'Leituras aceitas:',
      pdfSource: 'Fonte no PDF: lição {lesson}, página {page}.',
    },
    quiz: {
      question: 'Qual é o significado deste kanji?',
      shortcuts: 'Atalhos: 1-4 responde, Enter vai para a próxima, Esc fecha dicas.',
      showHint: 'Mostrar dica',
      nextQuestion: 'Próxima pergunta',
    },
    grid: {
      title: 'Lista completa',
      search: 'Buscar',
      searchPlaceholder: 'kanji, leitura kun/on ou significado',
      status: 'Status',
      statusAll: 'Todos',
      statusKnown: 'Sabia',
      statusUnknown: 'Não sabia',
      statusUnmarked: 'Sem marcação',
      resultOne: '{count} resultado',
      resultMany: '{count} resultados',
      meaning: 'Significado:',
      kunReading: 'Leitura Kun:',
      onReading: 'Leitura On:',
      hint: 'Dica:',
      source: 'Fonte:',
      statusLabel: 'Status:',
      lessonPage: 'lição {lesson}, p. {page}',
      noResults: 'Nenhum kanji encontrado com os filtros atuais.',
    },
    counting: {
      title: 'Prática de contagem em japonês',
      subtitle: 'Leia o número em kanji com o contador e escreva a leitura correta em hiragana.',
      shuffle: 'Embaralhar tipos',
      sequential: 'Números em ordem',
      countingType: 'Tipo atual',
      selectType: 'Tipo de contagem',
      numberPrompt: 'Escreva a leitura de',
      inputPlaceholder: 'Digite em romaji ou hiragana',
      check: 'Verificar',
      next: 'Próximo item',
      glossaryTitle: 'Glossário de contagem',
      glossarySubtitle: 'Referência rápida das leituras por número e tipo de contador.',
      glossaryFilterLabel: 'Filtrar tipo no glossário',
      glossaryAllTypes: 'Todos os tipos',
      glossaryCount: '{count} entradas',
      feedback: {
        required: 'Digite a leitura em hiragana.',
        correct: 'Boa! Resposta correta: {answer}.',
        wrong: 'Ainda não. Forma esperada: {answer}.',
      },
      types: {
        general: 'Objetos em geral (～つ)',
        people: 'Pessoas (～人)',
        mai: 'Objetos planos e finos (papel, foto, camisa) (～枚)',
        dai: 'Máquinas e veículos (carro, bicicleta, computador) (～台)',
        kai: 'Número de vezes / frequência (～回)',
      },
    },
    teForm: {
      title: 'Prática de verbos',
      subtitle: 'Treine forma て, tradução, ou inverta para responder o verbo em japonês.',
      invertPractice: 'Inverter tradução',
      answerTeForm: 'Responder forma て',
      answerTranslation: 'Responder tradução',
      promptLabel: 'Verbo base',
      translationPromptLabel: 'Tradução',
      teFormLabel: 'Forma て',
      translationLabel: 'Tradução',
      baseVerbLabel: 'Verbo em japonês',
      teFormPlaceholder: 'Digite a forma て',
      translationPlaceholder: 'Digite a tradução',
      baseVerbPlaceholder: 'Digite o verbo base em japonês',
      check: 'Verificar',
      next: 'Próximo verbo',
      rulesTitle: 'Regras da forma て',
      usesTitle: 'Usos da forma て',
      fullListTitle: 'Lista completa',
      fullListCount: '{count} verbos encontrados',
      lessonAll: 'Todas as lições',
      practiceLessonFilterLabel: 'Filtrar prática por lição',
      listLessonFilterLabel: 'Filtrar lista por lição',
      searchLabel: 'Buscar',
      searchPlaceholder: 'Digite verbo base ou tradução',
      searchFilterLabel: 'Filtrar por',
      searchFilterVerb: 'Verbo base',
      searchFilterTranslation: 'Tradução',
      noResults: 'Nenhum verbo encontrado com o filtro atual.',
      noPracticeResults: 'Nenhum verbo disponível para a lição selecionada.',
      feedback: {
        enableField: 'Habilite pelo menos um campo para validar a resposta.',
        correct: 'Boa. Resposta correta.',
        wrong: 'Ainda não.\nForma て correta: {teForm}\nTradução correta: {translation}',
        invertedWrong: 'Ainda não.\nVerbo correto: {verb}',
      },
      rules: {
        group1: {
          title: 'Grupo I',
          iChRi: 'Quando termina em い / ち / り antes de ます: troca por って',
          miBiNi: 'Quando termina em み / び / に antes de ます: troca por んで',
          ki: 'Quando termina em き antes de ます: troca por いて',
          gi: 'Quando termina em ぎ antes de ます: troca por いで',
          shi: 'Quando termina em し antes de ます: troca por して',
        },
        group2: {
          title: 'Grupo II',
          description: 'Remove ます e adiciona て.',
        },
        group3: {
          title: 'Grupo III',
          irregular: 'Verbos irregulares:',
          compound: 'Verbos compostos com します seguem o mesmo padrão:',
        },
        exception: 'Exceção:',
      },
      uses: '1. Pedido, instrução ou recomendação:\nV forma て + ください\nかいてください\nEscreva, por favor.|2. Ação em andamento:\nV forma て + います\nあめがふっています\nEstá chovendo.|3. Estado, posse, hábito ou condição:\nV forma て + います\nけっこんしています\nÉ casado(a).\nしっています\nSabe / conhece.\nすんでいます\nMora.|4. Permissão:\nV forma て + もいいですか\nしゃしんをとってもいいですか\nPosso tirar foto?|5. Proibição:\nV forma て + はいけません\nここでたばこをすってはいけません\nNão pode fumar aqui.|6. Conectar ações em sequência:\nV1 forma て, V2 forma て, V3\nシャワーをあびて、かいしゃへいきます\nTomo banho e vou para a empresa.|7. Fazer algo depois de outra ação:\nV forma て + から\nごはんをたべてから、べんきょうします\nDepois de comer, estudo.',
    },
    store: {
      sessionSummary: '{mode} | {shuffle} | {count} kanji no treino',
      shuffleOn: 'embaralhar: ligado',
      shuffleOff: 'embaralhar: desligado',
      sourceLabel: 'Lição {lesson} - p. {page}',
      noItems: 'Sem itens',
      inputKatakanaRequired: 'Digite a leitura em katakana.',
      inputHiraganaRequired: 'Digite a leitura em hiragana.',
      noOnReadings: 'Sem leituras on cadastradas para este kanji.',
      noKunReadings: 'Sem leituras kun cadastradas para este kanji.',
      wrongScriptKun: 'Essa leitura corresponde a kun (hiragana). Troque para hiragana no ícone de conversão.',
      wrongScriptOn: 'Essa leitura corresponde a on (katakana). Troque para katakana no ícone de conversão.',
      wrongAnswer: 'Ainda não. Leituras aceitas:\n{list}',
      alreadyRegistered: 'Você já registrou "{reading}".',
      goodSwitchHiragana: 'Boa. {found}/{total} leituras totais registradas. Troque para hiragana para continuar.',
      goodSwitchKatakana: 'Boa. {found}/{total} leituras totais registradas. Troque para katakana para continuar.',
      goodRemaining: 'Boa. {found}/{total} leituras totais registradas. Faltam {remaining}.',
      quizCorrect: 'Boa. {kanji} = {meaning}. Leitura: {reading}.',
      quizWrong: 'Quase. A resposta certa é {meaning}. Dica: {hint}',
      known: 'Sabia',
      unknown: 'Não sabia',
      unmarked: 'Sem marcação',
      inputKatakanaMode: 'No modo katakana, use katakana (leituras on).',
      inputHiraganaMode: 'No modo hiragana, use hiragana (leituras kun).',
    },
  },
  en: {
    app: {
      flashcards: 'Flashcards',
      quiz: 'Quiz',
      resetProgress: 'Reset progress',
      language: 'Language',
      kanjiPractice: 'Kanji',
      countingPractice: 'Counting',
      teFormPractice: 'Verbs',
    },
    header: {
      title: 'Kanji Identification Training',
      subtitle: 'Built to practice kanji recognition.',
      helpLabel: 'Show help',
      helpQuiz: 'Use 1-4 to answer, Enter for next, and Esc to close feedback.',
      helpNavigation: 'Use left/right arrows to move between cards.',
      helpList: 'Use search and status filters for review.',
      kanjiCount: 'kanji',
      known: 'knew',
      unknown: "didn't know",
    },
    metrics: {
      attempts: 'Attempts',
      correct: 'Correct',
      rate: 'Rate',
      streak: 'Streak',
      bestStreak: 'Best streak',
    },
    flashcard: {
      shuffle: 'Shuffle',
      fullTraining: 'Full training',
      reveal: 'Reveal',
      showHint: 'Show hint',
      showAnswer: 'Reveal answer',
      reading: 'Reading',
      submitReading: 'Check reading',
      navigation: 'Navigation',
      previous: 'Previous',
      next: 'Next',
      inputHiraganaPlaceholder: 'Type in romaji or hiragana',
      inputKatakanaPlaceholder: 'Type in romaji or katakana',
      switchToHiragana: 'Switch auto-conversion to hiragana',
      switchToKatakana: 'Switch auto-conversion to katakana',
      fullTrainingStatus: 'Full training enabled: {found}/{total} {script} readings registered.',
      fullTrainingTotal: 'Total for this kanji (kun + on): {found}/{total}.',
      scriptKun: 'kun (hiragana)',
      scriptOn: 'on (katakana)',
      acceptedReadings: 'Accepted readings:',
      pdfSource: 'PDF source: lesson {lesson}, page {page}.',
    },
    quiz: {
      question: 'What is the meaning of this kanji?',
      shortcuts: 'Shortcuts: 1-4 answers, Enter goes next, Esc closes hints.',
      showHint: 'Show hint',
      nextQuestion: 'Next question',
    },
    grid: {
      title: 'Full list',
      search: 'Search',
      searchPlaceholder: 'kanji, kun/on reading, or meaning',
      status: 'Status',
      statusAll: 'All',
      statusKnown: 'Knew',
      statusUnknown: "Didn't know",
      statusUnmarked: 'Unmarked',
      resultOne: '{count} result',
      resultMany: '{count} results',
      meaning: 'Meaning:',
      kunReading: 'Kun reading:',
      onReading: 'On reading:',
      hint: 'Hint:',
      source: 'Source:',
      statusLabel: 'Status:',
      lessonPage: 'lesson {lesson}, p. {page}',
      noResults: 'No kanji found with current filters.',
    },
    counting: {
      title: 'Japanese counting practice',
      subtitle: 'Read the kanji number with the counter and write the correct hiragana reading.',
      shuffle: 'Shuffle types',
      sequential: 'Sequential numbers',
      countingType: 'Current type',
      selectType: 'Counting type',
      numberPrompt: 'Write the reading for',
      inputPlaceholder: 'Type in romaji or hiragana',
      check: 'Check',
      next: 'Next item',
      glossaryTitle: 'Counting glossary',
      glossarySubtitle: 'Quick reference for readings by number and counter type.',
      glossaryFilterLabel: 'Glossary type filter',
      glossaryAllTypes: 'All types',
      glossaryCount: '{count} entries',
      feedback: {
        required: 'Type the reading in hiragana.',
        correct: 'Good! Correct answer: {answer}.',
        wrong: 'Not yet. Expected form: {answer}.',
      },
      types: {
        general: 'General objects (～つ)',
        people: 'People (～人)',
        mai: 'Flat/thin objects (paper, photo, shirt) (～枚)',
        dai: 'Machines and vehicles (car, bike, computer) (～台)',
        kai: 'Frequency / number of times (～回)',
      },
    },
    teForm: {
      title: 'Verb practice',
      subtitle: 'Practice the te form, translation, or invert the prompt to answer the Japanese verb.',
      invertPractice: 'Invert translation',
      answerTeForm: 'Answer te form',
      answerTranslation: 'Answer translation',
      promptLabel: 'Base verb',
      translationPromptLabel: 'Translation',
      teFormLabel: 'Te form',
      translationLabel: 'Translation',
      baseVerbLabel: 'Japanese verb',
      teFormPlaceholder: 'Type the te form',
      translationPlaceholder: 'Type the translation',
      baseVerbPlaceholder: 'Type the base verb in Japanese',
      check: 'Check',
      next: 'Next verb',
      rulesTitle: 'Te form rules',
      usesTitle: 'Uses of the te form',
      fullListTitle: 'Full list',
      fullListCount: '{count} verbs found',
      lessonAll: 'All lessons',
      practiceLessonFilterLabel: 'Filter practice by lesson',
      listLessonFilterLabel: 'Filter list by lesson',
      searchLabel: 'Search',
      searchPlaceholder: 'Type base verb or translation',
      searchFilterLabel: 'Filter by',
      searchFilterVerb: 'Base verb',
      searchFilterTranslation: 'Translation',
      noResults: 'No verbs found with the current filter.',
      noPracticeResults: 'No verbs available for the selected lesson.',
      feedback: {
        enableField: 'Enable at least one field to validate the answer.',
        correct: 'Good. Correct answer.',
        wrong: 'Not yet.\nCorrect te form: {teForm}\nCorrect translation: {translation}',
        invertedWrong: 'Not yet.\nCorrect verb: {verb}',
      },
      rules: {
        group1: {
          title: 'Group I',
          iChRi: 'When it ends in い / ち / り before ます: change to って',
          miBiNi: 'When it ends in み / び / に before ます: change to んで',
          ki: 'When it ends in き before ます: change to いて',
          gi: 'When it ends in ぎ before ます: change to いで',
          shi: 'When it ends in し before ます: change to して',
        },
        group2: {
          title: 'Group II',
          description: 'Remove ます and add て.',
        },
        group3: {
          title: 'Group III',
          irregular: 'Irregular verbs:',
          compound: 'Compound verbs with します follow the same pattern:',
        },
        exception: 'Exception:',
      },
      uses: '1. Request, instruction, or recommendation:\nV te form + ください\nかいてください\nPlease write.|2. Ongoing action:\nV te form + います\nあめがふっています\nIt is raining.|3. State, possession, habit, or condition:\nV te form + います\nけっこんしています\nIs married.\nしっています\nKnows.\nすんでいます\nLives.|4. Permission:\nV te form + もいいですか\nしゃしんをとってもいいですか\nMay I take a photo?|5. Prohibition:\nV te form + はいけません\nここでたばこをすってはいけません\nYou must not smoke here.|6. Connect actions in sequence:\nV1 te form, V2 te form, V3\nシャワーをあびて、かいしゃへいきます\nI take a shower and go to the company.|7. Do something after another action:\nV te form + から\nごはんをたべてから、べんきょうします\nAfter eating, I study.',
    },
    store: {
      sessionSummary: '{mode} | {shuffle} | {count} kanji in training',
      shuffleOn: 'shuffle: on',
      shuffleOff: 'shuffle: off',
      sourceLabel: 'Lesson {lesson} - p. {page}',
      noItems: 'No items',
      inputKatakanaRequired: 'Type the reading in katakana.',
      inputHiraganaRequired: 'Type the reading in hiragana.',
      noOnReadings: 'No on readings registered for this kanji.',
      noKunReadings: 'No kun readings registered for this kanji.',
      wrongScriptKun: 'This reading matches kun (hiragana). Switch to hiragana using the conversion icon.',
      wrongScriptOn: 'This reading matches on (katakana). Switch to katakana using the conversion icon.',
      wrongAnswer: 'Not yet. Accepted readings:\n{list}',
      alreadyRegistered: 'You already registered "{reading}".',
      goodSwitchHiragana: 'Good. {found}/{total} total readings registered. Switch to hiragana to continue.',
      goodSwitchKatakana: 'Good. {found}/{total} total readings registered. Switch to katakana to continue.',
      goodRemaining: 'Good. {found}/{total} total readings registered. {remaining} remaining.',
      quizCorrect: 'Good. {kanji} = {meaning}. Reading: {reading}.',
      quizWrong: 'Almost. The correct answer is {meaning}. Hint: {hint}',
      known: 'Knew',
      unknown: "Didn't know",
      unmarked: 'Unmarked',
      inputKatakanaMode: 'In katakana mode, use katakana (on readings).',
      inputHiraganaMode: 'In hiragana mode, use hiragana (kun readings).',
    },
  },
};

function normalizeLocale(value) {
  const raw = String(value || '').trim();
  if (!raw) return DEFAULT_LOCALE;
  const lowered = raw.toLowerCase();
  if (lowered.startsWith('pt')) return 'pt-BR';
  if (lowered.startsWith('en')) return 'en';
  return DEFAULT_LOCALE;
}

function loadLocale() {
  try {
    const saved = localStorage.getItem(LOCALE_KEY);
    if (saved) return normalizeLocale(saved);
  } catch {
    // no-op
  }

  return DEFAULT_LOCALE;
}

function persistLocale(value) {
  try {
    localStorage.setItem(LOCALE_KEY, value);
  } catch {
    // no-op
  }
}

function syncDocumentLang(value) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', value);
  }
}

const locale = ref(loadLocale());
persistLocale(locale.value);
syncDocumentLang(locale.value);

function setLocale(nextLocale) {
  const normalized = normalizeLocale(nextLocale);
  if (locale.value === normalized) return;
  locale.value = normalized;
  persistLocale(normalized);
  syncDocumentLang(normalized);
}

function resolvePath(obj, path) {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

function interpolate(template, params = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => (params[key] ?? `{${key}}`));
}

function t(key, params = {}) {
  const currentMessages = messages[locale.value] || messages[DEFAULT_LOCALE];
  const fallbackMessages = messages[DEFAULT_LOCALE];
  const template = resolvePath(currentMessages, key) ?? resolvePath(fallbackMessages, key) ?? key;
  return interpolate(template, params);
}

const supportedLocales = [
  { code: 'pt-BR', label: 'Português' },
  { code: 'en', label: 'English' },
];

export function useI18n() {
  return {
    locale,
    setLocale,
    supportedLocales,
    t,
  };
}

export {
  locale,
  setLocale,
  supportedLocales,
  t,
};
