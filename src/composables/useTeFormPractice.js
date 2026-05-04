import { computed, ref } from 'vue';
import { toHiragana as wanakanaToHiragana, toKatakana as wanakanaToKatakana } from 'wanakana';
import { teFormVerbData } from '../data/teFormVerbData';
import { useI18n } from '../i18n';

function createStats() {
  return {
    attempts: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    bestStreak: 0,
  };
}

function randomIndex(max) {
  return Math.floor(Math.random() * max);
}

export function normalizeTranslation(value) {
  return String(value || '')
    .toLocaleLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

export function normalizeSearchTerm(value) {
  return normalizeTranslation(value)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

export function isTeFormAnswerCorrect(candidate, expected) {
  return normalizeKana(candidate) === normalizeKana(expected);
}

export function isTranslationAnswerCorrect(candidate, expected) {
  const normalizedCandidate = normalizeTranslation(candidate);
  return splitTranslationVariants(expected).some(variant => normalizeTranslation(variant) === normalizedCandidate);
}

export function useTeFormPractice(verbs = teFormVerbData) {
  const { t } = useI18n();
  const verbList = ref(verbs);
  const currentIndex = ref(0);
  const teFormEnabled = ref(true);
  const translationEnabled = ref(false);
  const teFormInput = ref('');
  const teFormInputScript = ref('hiragana');
  const translationInput = ref('');
  const practiceLessonFilter = ref('all');
  const verbListSearch = ref('');
  const verbListFilter = ref('verb');
  const verbListLessonFilter = ref('all');
  const feedback = ref('');
  const feedbackState = ref('idle');
  const stats = ref(createStats());

  const lessonOptions = computed(() => [
    { value: 'all', label: t('teForm.lessonAll') },
    ...getUniqueLessons(verbList.value).map(lesson => ({ value: lesson, label: lesson })),
  ]);
  const practiceVerbPool = computed(() => filterByLesson(verbList.value, practiceLessonFilter.value));
  const currentVerb = computed(() => practiceVerbPool.value[currentIndex.value] || null);
  const filteredVerbList = computed(() => {
    const lessonFiltered = filterByLesson(verbList.value, verbListLessonFilter.value);
    const query = normalizeSearchTerm(verbListSearch.value);
    if (!query) return lessonFiltered;

    return lessonFiltered.filter(item => {
      const target = verbListFilter.value === 'translation' ? item.translation : item.verb;
      return normalizeSearchTerm(target).includes(query);
    });
  });
  const groupedFilteredVerbList = computed(() => {
    const groups = new Map();

    filteredVerbList.value.forEach(item => {
      if (!groups.has(item.lesson)) {
        groups.set(item.lesson, []);
      }

      groups.get(item.lesson).push(item);
    });

    return Array.from(groups, ([lesson, items]) => ({ lesson, items }));
  });
  const sessionRate = computed(() => {
    const { attempts, correct } = stats.value;
    return attempts ? Math.round((correct / attempts) * 100) : 0;
  });

  resetCurrentIndex();

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

  function clearAnswer() {
    teFormInput.value = '';
    teFormInputScript.value = 'hiragana';
    translationInput.value = '';
    feedback.value = '';
    feedbackState.value = 'idle';
  }

  function nextVerb() {
    if (!practiceVerbPool.value.length) return;

    if (practiceVerbPool.value.length === 1) {
      currentIndex.value = 0;
      clearAnswer();
      return;
    }

    let nextIndex = randomIndex(practiceVerbPool.value.length);
    while (nextIndex === currentIndex.value) {
      nextIndex = randomIndex(practiceVerbPool.value.length);
    }

    currentIndex.value = nextIndex;
    clearAnswer();
  }

  function submitAnswer() {
    if (!currentVerb.value) return;

    if (!teFormEnabled.value && !translationEnabled.value) {
      feedback.value = t('teForm.feedback.enableField');
      feedbackState.value = 'warning';
      return;
    }

    const teFormCorrect = !teFormEnabled.value || isTeFormAnswerCorrect(teFormInput.value, currentVerb.value.teForm);
    const translationCorrect = !translationEnabled.value || isTranslationAnswerCorrect(translationInput.value, currentVerb.value.translation);
    const correct = teFormCorrect && translationCorrect;

    registerAttempt(correct);
    feedbackState.value = correct ? 'correct' : 'wrong';
    feedback.value = correct
      ? t('teForm.feedback.correct')
      : t('teForm.feedback.wrong', {
        teForm: currentVerb.value.teForm,
        translation: currentVerb.value.translation,
      });

    if (correct) {
      nextVerb();
    }
  }

  function setTeFormInput(value) {
    teFormInput.value = teFormInputScript.value === 'katakana'
      ? wanakanaToKatakana(String(value || ''), { IMEMode: true })
      : wanakanaToHiragana(String(value || ''), { IMEMode: true });
    feedback.value = '';
    feedbackState.value = 'idle';
  }

  function toggleTeFormInputScript() {
    teFormInputScript.value = teFormInputScript.value === 'katakana' ? 'hiragana' : 'katakana';
    setTeFormInput(teFormInput.value);
  }

  function setTeFormEnabled(value) {
    teFormEnabled.value = Boolean(value);
    feedback.value = '';
    feedbackState.value = 'idle';
  }

  function setTranslationEnabled(value) {
    translationEnabled.value = Boolean(value);
    feedback.value = '';
    feedbackState.value = 'idle';
  }

  function setPracticeLessonFilter(value) {
    practiceLessonFilter.value = value;
    resetCurrentIndex();
    clearAnswer();
  }

  function setVerbListLessonFilter(value) {
    verbListLessonFilter.value = value;
  }

  return {
    verbList,
    currentVerb,
    lessonOptions,
    teFormEnabled,
    translationEnabled,
    teFormInput,
    teFormInputScript,
    translationInput,
    practiceLessonFilter,
    verbListSearch,
    verbListFilter,
    verbListLessonFilter,
    filteredVerbList,
    groupedFilteredVerbList,
    feedback,
    feedbackState,
    stats,
    sessionRate,
    nextVerb,
    submitAnswer,
    setTeFormInput,
    toggleTeFormInputScript,
    setTeFormEnabled,
    setTranslationEnabled,
    setPracticeLessonFilter,
    setVerbListLessonFilter,
  };

  function resetCurrentIndex() {
    currentIndex.value = practiceVerbPool.value.length ? randomIndex(practiceVerbPool.value.length) : 0;
  }
}

function normalizeKana(value) {
  const converted = wanakanaToHiragana(String(value || '').trim());
  return converted.replace(/[^ぁ-んー]/g, '');
}

function filterByLesson(items, lesson) {
  if (lesson === 'all') return items;
  return items.filter(item => item.lesson === lesson);
}

function getUniqueLessons(items) {
  return [...new Set(items.map(item => item.lesson).filter(Boolean))];
}

function splitTranslationVariants(value) {
  return String(value || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}
