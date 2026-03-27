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
