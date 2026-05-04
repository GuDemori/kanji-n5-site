import { computed, ref } from 'vue';
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
  return String(candidate || '').trim() === expected;
}

export function isTranslationAnswerCorrect(candidate, expected) {
  return normalizeTranslation(candidate) === normalizeTranslation(expected);
}

export function useTeFormPractice(verbs = teFormVerbData) {
  const { t } = useI18n();
  const verbList = ref(verbs);
  const currentIndex = ref(verbList.value.length ? randomIndex(verbList.value.length) : 0);
  const teFormEnabled = ref(true);
  const translationEnabled = ref(false);
  const teFormInput = ref('');
  const translationInput = ref('');
  const verbListSearch = ref('');
  const verbListFilter = ref('verb');
  const feedback = ref('');
  const feedbackState = ref('idle');
  const stats = ref(createStats());

  const currentVerb = computed(() => verbList.value[currentIndex.value] || null);
  const filteredVerbList = computed(() => {
    const query = normalizeSearchTerm(verbListSearch.value);
    if (!query) return verbList.value;

    return verbList.value.filter(item => {
      const target = verbListFilter.value === 'translation' ? item.translation : item.verb;
      return normalizeSearchTerm(target).includes(query);
    });
  });
  const sessionRate = computed(() => {
    const { attempts, correct } = stats.value;
    return attempts ? Math.round((correct / attempts) * 100) : 0;
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

  function clearAnswer() {
    teFormInput.value = '';
    translationInput.value = '';
    feedback.value = '';
    feedbackState.value = 'idle';
  }

  function nextVerb() {
    if (!verbList.value.length) return;

    if (verbList.value.length === 1) {
      currentIndex.value = 0;
      clearAnswer();
      return;
    }

    let nextIndex = randomIndex(verbList.value.length);
    while (nextIndex === currentIndex.value) {
      nextIndex = randomIndex(verbList.value.length);
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

  return {
    verbList,
    currentVerb,
    teFormEnabled,
    translationEnabled,
    teFormInput,
    translationInput,
    verbListSearch,
    verbListFilter,
    filteredVerbList,
    feedback,
    feedbackState,
    stats,
    sessionRate,
    nextVerb,
    submitAnswer,
    setTeFormEnabled,
    setTranslationEnabled,
  };
}
