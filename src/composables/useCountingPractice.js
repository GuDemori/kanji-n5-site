import { computed, ref } from 'vue';
import { toHiragana as wanakanaToHiragana } from 'wanakana';
import { useI18n } from '../i18n';

const COUNTING_TYPES = ['general', 'people', 'mai', 'dai', 'kai'];
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '?'];
const SEQUENTIAL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const numberKanji = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '七',
  8: '八',
  9: '九',
  10: '十',
  '?': '何',
};

const sinoReadings = {
  1: 'いち',
  2: 'に',
  3: 'さん',
  4: 'よん',
  5: 'ご',
  6: 'ろく',
  7: 'なな',
  8: 'はち',
  9: 'きゅう',
  10: 'じゅう',
};

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function toHiraganaInput(value) {
  return wanakanaToHiragana(String(value || ''), { IMEMode: true });
}

function normalizeKana(value) {
  const converted = wanakanaToHiragana(String(value || ''));
  return converted.replace(/[^ぁ-んー]/g, '');
}

function getCountingReadings(type, number) {
  if (number === '?') {
    if (type === 'general') return ['いくつ'];
    if (type === 'people') return ['なんにん'];
    if (type === 'mai') return ['なんまい'];
    if (type === 'dai') return ['なんだい'];
    return ['なんかい'];
  }

  if (type === 'general') {
    const map = {
      1: ['ひとつ'],
      2: ['ふたつ'],
      3: ['みっつ'],
      4: ['よっつ'],
      5: ['いつつ'],
      6: ['むっつ'],
      7: ['ななつ'],
      8: ['やっつ'],
      9: ['ここのつ'],
      10: ['とお'],
    };
    return map[number];
  }

  if (type === 'people') {
    if (number === 1) return ['ひとり'];
    if (number === 2) return ['ふたり'];
    const map = {
      3: ['さんにん'],
      4: ['よにん', 'よんにん'],
      5: ['ごにん'],
      6: ['ろくにん'],
      7: ['ななにん', 'しちにん'],
      8: ['はちにん'],
      9: ['きゅうにん'],
      10: ['じゅうにん'],
    };
    return map[number];
  }

  if (type === 'mai') return [`${sinoReadings[number]}まい`];
  if (type === 'dai') return [`${sinoReadings[number]}だい`];

  if (type === 'kai') {
    const map = {
      1: ['いっかい'],
      2: ['にかい'],
      3: ['さんかい'],
      4: ['よんかい'],
      5: ['ごかい'],
      6: ['ろっかい'],
      7: ['ななかい'],
      8: ['はっかい'],
      9: ['きゅうかい'],
      10: ['じゅっかい', 'じっかい'],
    };
    return map[number];
  }

  return [];
}

function getCounterLabel(type, number) {
  const kanjiNumber = numberKanji[number];
  if (type === 'general') return `${kanjiNumber}つ`;
  if (type === 'people') return `${kanjiNumber}人`;
  if (type === 'mai') return `${kanjiNumber}枚`;
  if (type === 'dai') return `${kanjiNumber}台`;
  return `${kanjiNumber}回`;
}

export function useCountingPractice() {
  const { t } = useI18n();

  const selectedType = ref('general');
  const glossaryType = ref('all');
  const shuffleEnabled = ref(false);
  const sequentialEnabled = ref(false);
  const sequentialIndex = ref(0);
  const answerInput = ref('');
  const feedback = ref('');

  const stats = ref({
    attempts: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    bestStreak: 0,
  });

  function buildPrompt() {
    const type = shuffleEnabled.value ? randomFrom(COUNTING_TYPES) : selectedType.value;
    const number = sequentialEnabled.value
      ? SEQUENTIAL_NUMBERS[sequentialIndex.value % SEQUENTIAL_NUMBERS.length]
      : randomFrom(NUMBERS);

    if (sequentialEnabled.value) {
      sequentialIndex.value += 1;
    }

    const expectedVariants = getCountingReadings(type, number);

    return {
      type,
      number,
      expected: expectedVariants[0] || '',
      expectedVariants,
      counterLabel: getCounterLabel(type, number),
    };
  }

  const currentPrompt = ref(buildPrompt());

  const sessionRate = computed(() => {
    const { attempts, correct } = stats.value;
    return attempts ? Math.round((correct / attempts) * 100) : 0;
  });

  const typeOptions = computed(() => ([
    { value: 'general', label: t('counting.types.general') },
    { value: 'people', label: t('counting.types.people') },
    { value: 'mai', label: t('counting.types.mai') },
    { value: 'dai', label: t('counting.types.dai') },
    { value: 'kai', label: t('counting.types.kai') },
  ]));

  const currentTypeLabel = computed(() => t(`counting.types.${currentPrompt.value.type}`));

  const glossaryRows = computed(() => {
    const types = glossaryType.value === 'all' ? COUNTING_TYPES : [glossaryType.value];
    return types.flatMap(type => NUMBERS.map(number => ({
      id: `${type}-${number}`,
      type,
      typeLabel: t(`counting.types.${type}`),
      expression: getCounterLabel(type, number),
      reading: getCountingReadings(type, number).join(' / '),
    })));
  });

  function registerAttempt(correct) {
    stats.value.attempts += 1;

    if (correct) {
      stats.value.correct += 1;
      stats.value.streak += 1;
      stats.value.bestStreak = Math.max(stats.value.bestStreak, stats.value.streak);
      return;
    }

    stats.value.wrong += 1;
    stats.value.streak = 0;
  }

  function nextPrompt() {
    currentPrompt.value = buildPrompt();
    answerInput.value = '';
  }

  function setInput(value) {
    answerInput.value = toHiraganaInput(value);
    feedback.value = '';
  }

  function submitAnswer() {
    const candidate = normalizeKana(answerInput.value);
    if (!candidate) {
      feedback.value = t('counting.feedback.required');
      return;
    }

    if (currentPrompt.value.expectedVariants.includes(candidate)) {
      registerAttempt(true);
      feedback.value = t('counting.feedback.correct', { answer: currentPrompt.value.expected });
      nextPrompt();
      return;
    }

    registerAttempt(false);
    feedback.value = t('counting.feedback.wrong', { answer: currentPrompt.value.expected });
  }

  function onTypeChange(value) {
    selectedType.value = value;
    if (!shuffleEnabled.value) {
      nextPrompt();
    }
  }

  function onShuffleChange(value) {
    shuffleEnabled.value = Boolean(value);
    nextPrompt();
  }

  function onSequentialChange(value) {
    sequentialEnabled.value = Boolean(value);
    sequentialIndex.value = 0;
    nextPrompt();
  }

  return {
    selectedType,
    glossaryType,
    shuffleEnabled,
    sequentialEnabled,
    answerInput,
    feedback,
    stats,
    currentPrompt,
    sessionRate,
    typeOptions,
    currentTypeLabel,
    glossaryRows,
    setInput,
    submitAnswer,
    nextPrompt,
    onTypeChange,
    onShuffleChange,
    onSequentialChange,
  };
}
