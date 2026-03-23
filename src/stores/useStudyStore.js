import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { toHiragana as wanakanaToHiragana } from 'wanakana';
import { kanjiData } from '../data/kanjiData';

const STORAGE_KEY = 'kanji-n5-progress-v1';
const SESSION_KEY = 'kanji-n5-session-v1';

const ROMAJI_MAP = {
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  sa: 'さ', shi: 'し', su: 'す', se: 'せ', so: 'そ',
  ta: 'た', chi: 'ち', tsu: 'つ', te: 'て', to: 'と',
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', fu: 'ふ', he: 'へ', ho: 'ほ',
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  ya: 'や', yu: 'ゆ', yo: 'よ',
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  wa: 'わ', wo: 'を',
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
  za: 'ざ', ji: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  da: 'だ', de: 'で', do: 'ど',
  ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
  pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
  kya: 'きゃ', kyu: 'きゅ', kyo: 'きょ',
  gya: 'ぎゃ', gyu: 'ぎゅ', gyo: 'ぎょ',
  sha: 'しゃ', shu: 'しゅ', sho: 'しょ',
  ja: 'じゃ', ju: 'じゅ', jo: 'じょ',
  cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ',
  nya: 'にゃ', nyu: 'にゅ', nyo: 'にょ',
  hya: 'ひゃ', hyu: 'ひゅ', hyo: 'ひょ',
  bya: 'びゃ', byu: 'びゅ', byo: 'びょ',
  pya: 'ぴゃ', pyu: 'ぴゅ', pyo: 'ぴょ',
  mya: 'みゃ', myu: 'みゅ', myo: 'みょ',
  rya: 'りゃ', ryu: 'りゅ', ryo: 'りょ',
};

function createSessionStats() {
  return {
    attempts: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    bestStreak: 0,
  };
}

export const useStudyStore = defineStore('study', () => {
  const sourceData = ref(normalizeData(kanjiData));
  const initialSession = loadSession();

  const mode = ref(initialSession.mode);
  const shuffleEnabled = ref(initialSession.shuffle);
  const deck = ref([]);
  const currentIndex = ref(0);

  const gridSearch = ref('');
  const gridStatusFilter = ref('all');

  const progress = ref(loadProgress());
  const sessionStats = ref(createSessionStats());

  const flashcardHint = ref('');
  const flashcardAnswerVisible = ref(false);
  const readingInput = ref('');
  const readingFeedback = ref('');
  const requireAllReadings = ref(initialSession.requireAllReadings);
  const foundReadings = ref([]);

  const quizFeedback = ref('');
  const quizOptions = ref([]);
  const quizAnswered = ref(false);
  const selectedOption = ref('');
  const helpOpen = ref(false);

  const current = computed(() => deck.value[currentIndex.value] || null);

  const totalCount = computed(() => deck.value.length);
  const knownCount = computed(() => progress.value.known.length);
  const unknownCount = computed(() => progress.value.unknown.length);

  const sessionRate = computed(() => {
    const { attempts, correct } = sessionStats.value;
    return attempts ? Math.round((correct / attempts) * 100) : 0;
  });

  const sessionSummary = computed(() => {
    const modeLabel = mode.value === 'quiz' ? 'Quiz' : 'Flashcards';
    const shuffleLabel = shuffleEnabled.value ? 'embaralhar: ligado' : 'embaralhar: desligado';
    return `${modeLabel} | ${shuffleLabel} | ${deck.value.length} kanji no treino`;
  });

  const cardPosition = computed(() => {
    if (!deck.value.length) return '0 / 0';
    return `${currentIndex.value + 1} / ${deck.value.length}`;
  });

  const sourceLabel = computed(() => {
    if (!current.value) return 'Sem itens';
    return `Lição ${current.value.lesson} - p. ${current.value.page}`;
  });

  const flashcardAnswer = computed(() => {
    if (!flashcardAnswerVisible.value || !current.value) return null;
    return {
      title: `${current.value.kanji} - ${current.value.meaning}`,
      reading: formatReadingsSummary(current.value),
      source: `Fonte no PDF: lição ${current.value.lesson}, página ${current.value.page}.`,
    };
  });

  const currentAcceptedReadings = computed(() => getAcceptedReadingsForItem(current.value));
  const readingsTotalCount = computed(() => currentAcceptedReadings.value.length);
  const readingsFoundCount = computed(() => foundReadings.value.length);
  const readingsFoundPreview = computed(() => foundReadings.value.join(' ・ '));

  const gridFilteredData = computed(() => {
    const query = normalizeSearchTerm(gridSearch.value);

    return sourceData.value.filter(item => {
      if (!matchesGridStatus(item.id, gridStatusFilter.value, progress.value)) {
        return false;
      }

      if (!query) return true;

      const searchable = normalizeSearchTerm([
        item.kanji,
        item.meaning,
        item.reading,
        item.kunReading,
        item.onReading,
        item.hintText,
      ].join(' '));

      return searchable.includes(query);
    });
  });

  function init() {
    buildDeck({ preferredCardId: initialSession.currentCardId });
  }

  function setMode(nextMode) {
    mode.value = nextMode === 'quiz' ? 'quiz' : 'flashcard';
    clearFeedbackPanels();
    prepareQuizOptions();
    saveSession();
  }

  function setShuffle(enabled) {
    shuffleEnabled.value = Boolean(enabled);
    buildDeck({ preferredCardId: current.value ? current.value.id : null });
  }

  function buildDeck({ preferredCardId = null } = {}) {
    const filtered = [...sourceData.value];
    deck.value = shuffleEnabled.value ? shuffle([...filtered]) : filtered;

    currentIndex.value = getDeckStartIndex(deck.value, preferredCardId);

    clearFeedbackPanels();
    prepareQuizOptions();
    saveSession();
  }

  function moveCard(direction) {
    if (!deck.value.length) return;

    currentIndex.value += direction;
    if (currentIndex.value < 0) currentIndex.value = deck.value.length - 1;
    if (currentIndex.value >= deck.value.length) currentIndex.value = 0;

    clearFeedbackPanels();
    prepareQuizOptions();
    saveSession();
  }

  function advanceAfterSuccess() {
    if (!deck.value.length) return;

    currentIndex.value = (currentIndex.value + 1) % deck.value.length;
    clearFeedbackPanels();
    prepareQuizOptions();
    saveSession();
  }

  function showFlashcardHint() {
    if (!current.value) return;
    flashcardHint.value = current.value.hintText;
  }

  function showFlashcardAnswer() {
    if (!current.value) return;
    flashcardAnswerVisible.value = true;
  }

  function setReadingInput(value) {
    readingInput.value = toHiraganaInput(value);
    readingFeedback.value = '';
  }

  function setRequireAllReadings(enabled) {
    requireAllReadings.value = Boolean(enabled);
    clearReadingProgress();
    saveSession();
  }

  function submitReadingAttempt() {
    if (!current.value) return;

    const candidate = normalizeKana(readingInput.value);
    if (!candidate) {
      readingFeedback.value = 'Digite a leitura em hiragana.';
      return;
    }

    const accepted = currentAcceptedReadings.value;
    if (!accepted.length) {
      readingFeedback.value = 'Sem leituras cadastradas para este kanji.';
      return;
    }

    const matchedReading = findMatchingAccepted(candidate, accepted);
    const correct = Boolean(matchedReading);

    if (!correct) {
      registerAttempt(false);
      readingFeedback.value = `Ainda não. Leituras aceitas:\n${formatAcceptedReadingsList(current.value)}`;
      return;
    }

    if (!requireAllReadings.value) {
      registerAttempt(true);
      markKnown(current.value.id);
      advanceAfterSuccess();
      return;
    }

    if (foundReadings.value.includes(matchedReading)) {
      readingFeedback.value = `Você já registrou "${matchedReading}".`;
      readingInput.value = '';
      return;
    }

    registerAttempt(true);
    foundReadings.value = [...foundReadings.value, matchedReading];
    readingInput.value = '';

    if (foundReadings.value.length >= accepted.length) {
      markKnown(current.value.id);
      advanceAfterSuccess();
      return;
    }

    const remaining = accepted.length - foundReadings.value.length;
    readingFeedback.value = `Boa. ${foundReadings.value.length}/${accepted.length} leituras registradas. Faltam ${remaining}.`;
  }

  function showQuizHint() {
    if (!current.value) return;
    quizFeedback.value = current.value.hintText;
  }

  function answerQuiz(option) {
    if (!current.value || quizAnswered.value) return;

    quizAnswered.value = true;
    selectedOption.value = option;

    const isCorrect = option === current.value.meaning;
    registerAttempt(isCorrect);

    quizFeedback.value = isCorrect
      ? `Boa. ${current.value.kanji} = ${current.value.meaning}. Leitura: ${current.value.reading}.`
      : `Quase. A resposta certa é ${current.value.meaning}. Dica: ${current.value.hintText}`;
  }

  function markKnown(id) {
    progress.value.known = unique([...progress.value.known, id]);
    progress.value.unknown = progress.value.unknown.filter(itemId => itemId !== id);
    saveProgress();
  }

  function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
    progress.value = { known: [], unknown: [] };
    resetSessionStats();
    buildDeck({ preferredCardId: current.value ? current.value.id : null });
  }

  function getProgressState(id) {
    if (progress.value.known.includes(id)) return 'Sabia';
    if (progress.value.unknown.includes(id)) return 'Não sabia';
    return 'Sem marcação';
  }

  function prepareQuizOptions() {
    if (!current.value) {
      quizOptions.value = [];
      quizAnswered.value = false;
      selectedOption.value = '';
      return;
    }

    const distractors = shuffle(
      sourceData.value
        .filter(item => item.id !== current.value.id)
        .map(item => item.meaning)
    ).slice(0, 3);

    quizOptions.value = shuffle([current.value.meaning, ...distractors]);
    quizAnswered.value = false;
    selectedOption.value = '';
  }

  function clearFeedbackPanels() {
    flashcardHint.value = '';
    flashcardAnswerVisible.value = false;
    clearReadingProgress();
    quizFeedback.value = '';
  }

  function clearReadingProgress() {
    readingInput.value = '';
    readingFeedback.value = '';
    foundReadings.value = [];
  }

  function resetSessionStats() {
    sessionStats.value = createSessionStats();
  }

  function registerAttempt(correct) {
    sessionStats.value.attempts += 1;

    if (correct) {
      sessionStats.value.correct += 1;
      sessionStats.value.streak += 1;
      sessionStats.value.bestStreak = Math.max(sessionStats.value.bestStreak, sessionStats.value.streak);
      return;
    }

    sessionStats.value.wrong += 1;
    sessionStats.value.streak = 0;
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress.value));
  }

  function saveSession() {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      mode: mode.value,
      shuffle: shuffleEnabled.value,
      currentCardId: current.value ? current.value.id : null,
      requireAllReadings: requireAllReadings.value,
    }));
  }

  function toggleHelpTooltip() {
    helpOpen.value = !helpOpen.value;
  }

  function hideHelpTooltip() {
    helpOpen.value = false;
  }

  function hideFeedbackPanels() {
    clearFeedbackPanels();
  }

  return {
    cardPosition,
    current,
    deck,
    flashcardAnswer,
    flashcardHint,
    getProgressState,
    gridFilteredData,
    gridSearch,
    gridStatusFilter,
    helpOpen,
    knownCount,
    mode,
    moveCard,
    answerQuiz,
    quizAnswered,
    quizFeedback,
    quizOptions,
    resetProgress,
    selectedOption,
    requireAllReadings,
    sessionRate,
    sessionStats,
    sessionSummary,
    setMode,
    setShuffle,
    showFlashcardAnswer,
    showFlashcardHint,
    showQuizHint,
    sourceLabel,
    sourceData,
    shuffleEnabled,
    toggleHelpTooltip,
    hideHelpTooltip,
    hideFeedbackPanels,
    totalCount,
    unknownCount,
    readingInput,
    readingFeedback,
    readingsTotalCount,
    readingsFoundCount,
    readingsFoundPreview,
    setReadingInput,
    setRequireAllReadings,
    submitReadingAttempt,
    init,
  };
});

function normalizeData(data) {
  const ids = new Set();

  return data
    .filter(item => {
      const hasRequiredFields = item
        && Number.isInteger(item.id)
        && typeof item.kanji === 'string'
        && typeof item.reading === 'string'
        && typeof item.meaning === 'string'
        && Number.isInteger(item.lesson)
        && Number.isInteger(item.page)
        && typeof item.hint === 'string';

      if (!hasRequiredFields || ids.has(item.id)) {
        return false;
      }

      ids.add(item.id);
      return true;
    })
    .map(item => ({
      ...item,
      hintText: htmlToText(item.hint),
    }));
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { known: [], unknown: [] };

    const parsed = JSON.parse(raw);
    return {
      known: Array.isArray(parsed.known) ? parsed.known : [],
      unknown: Array.isArray(parsed.unknown) ? parsed.unknown : [],
    };
  } catch {
    return { known: [], unknown: [] };
  }
}

function loadSession() {
  const fallback = {
    mode: 'flashcard',
    shuffle: true,
    currentCardId: null,
    requireAllReadings: false,
  };

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    return {
      mode: parsed.mode === 'quiz' ? 'quiz' : 'flashcard',
      shuffle: typeof parsed.shuffle === 'boolean' ? parsed.shuffle : true,
      currentCardId: Number.isInteger(parsed.currentCardId) ? parsed.currentCardId : null,
      requireAllReadings: typeof parsed.requireAllReadings === 'boolean' ? parsed.requireAllReadings : false,
    };
  } catch {
    return fallback;
  }
}

function getDeckStartIndex(deck, preferredCardId) {
  if (!deck.length || !preferredCardId) return 0;

  const preferredIndex = deck.findIndex(item => item.id === preferredCardId);
  return preferredIndex >= 0 ? preferredIndex : 0;
}

function matchesGridStatus(id, filter, progress) {
  if (filter === 'all') return true;
  if (filter === 'known') return progress.known.includes(id);
  if (filter === 'unknown') return progress.unknown.includes(id);
  return !progress.known.includes(id) && !progress.unknown.includes(id);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function unique(array) {
  return [...new Set(array)];
}

function normalizeSearchTerm(value) {
  return String(value || '')
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}

function htmlToText(value) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(value, 'text/html');

  doc.body.querySelectorAll('ruby').forEach(ruby => {
    const rt = ruby.querySelector('rt');
    const rtText = rt ? (rt.textContent || '').trim() : '';

    const clone = ruby.cloneNode(true);
    clone.querySelectorAll('rt').forEach(node => node.remove());
    const baseText = (clone.textContent || '').replace(/\s+/g, ' ').trim();

    const replacement = rtText ? baseText + ' (' + rtText + ')' : baseText;
    ruby.replaceWith(doc.createTextNode(replacement));
  });

  const text = doc.body.textContent || '';
  return text.replace(/\s+/g, ' ').trim();
}

function getAcceptedReadings(reading) {
  return unique(
    String(reading || '')
      .split(/[・/、,\s]+/)
      .map(part => normalizeKana(part))
      .filter(Boolean)
  );
}

function getAcceptedReadingsForItem(item) {
  if (!item) return [];

  return unique([
    ...getAcceptedReadings(item.kunReading),
    ...getAcceptedReadings(item.onReading),
    ...getAcceptedReadings(item.reading),
  ]);
}

function findMatchingAccepted(candidate, accepted) {
  const normalizedCandidate = candidate.replace(/\u30fc/g, '');
  return accepted.find(item => item === candidate || item.replace(/\u30fc/g, '') === normalizedCandidate) || null;
}

function formatReadingsSummary(item) {
  const kun = String(item?.kunReading || '').trim();
  const on = String(item?.onReading || '').trim();

  if (kun && on) return `kun: ${kun} | on: ${on}`;
  return kun || on || '-';
}

function formatAcceptedReadingsList(item) {
  const entries = getDisplayReadingsForItem(item);
  if (!entries.length) return '* -';
  return entries.map(entry => `* ${entry}`).join('\n');
}

function getDisplayReadingsForItem(item) {
  const kunEntries = splitReadingTokens(item?.kunReading).map(token => `kun: ${token}`);
  const onEntries = splitReadingTokens(item?.onReading).map(token => `on: ${token}`);
  return unique([...kunEntries, ...onEntries]);
}

function splitReadingTokens(reading) {
  return String(reading || '')
    .split(/[・/、,\s]+/)
    .map(part => part.trim())
    .filter(Boolean);
}

function normalizeKana(value) {
  const converted = wanakanaToHiragana(String(value || ''));
  return converted.replace(/[^ぁ-んー]/g, '');
}

function toHiraganaInput(value) {
  return wanakanaToHiragana(String(value || ''), { IMEMode: true });
}

function romajiToHiraganaToken(token) {
  let output = '';
  let i = 0;

  while (i < token.length) {
    const current = token[i];
    const next = token[i + 1];

    if (current === 'n') {
      if (!next) {
        output += 'ん';
        i += 1;
        continue;
      }

      if (next === 'n') {
        output += 'ん';
        i += 1;
        continue;
      }

      if (!'aiueoy'.includes(next)) {
        output += 'ん';
        i += 1;
        continue;
      }
    }

    if (next && current === next && !'aeioun'.includes(current)) {
      output += 'っ';
      i += 1;
      continue;
    }

    const part3 = token.slice(i, i + 3);
    if (ROMAJI_MAP[part3]) {
      output += ROMAJI_MAP[part3];
      i += 3;
      continue;
    }

    const part2 = token.slice(i, i + 2);
    if (ROMAJI_MAP[part2]) {
      output += ROMAJI_MAP[part2];
      i += 2;
      continue;
    }

    if (ROMAJI_MAP[current]) {
      output += ROMAJI_MAP[current];
      i += 1;
      continue;
    }

    output += current;
    i += 1;
  }

  return output;
}
