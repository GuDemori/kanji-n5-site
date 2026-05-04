<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import HeroHeader from './components/HeroHeader.vue';
import PracticeRouteTabs from './components/PracticeRouteTabs.vue';
import StudyToolbar from './components/StudyToolbar.vue';
import SessionMetrics from './components/SessionMetrics.vue';
import FlashcardPanel from './components/FlashcardPanel.vue';
import QuizPanel from './components/QuizPanel.vue';
import KanjiGridPanel from './components/KanjiGridPanel.vue';
import CountingPracticeView from './components/CountingPracticeView.vue';
import TeFormPracticeView from './components/TeFormPracticeView.vue';
import { useStudyStore } from './stores/useStudyStore';

function getCurrentPath() {
  if (typeof window === 'undefined') return '/';

  const redirectedPath = new URLSearchParams(window.location.search).get('p');
  if (redirectedPath === '/counting') return '/counting';
  if (redirectedPath === '/te-form') return '/te-form';

  if (window.location.pathname === '/counting') return '/counting';
  if (window.location.pathname === '/te-form') return '/te-form';
  return '/';
}

const store = useStudyStore();
const {
  cardPosition,
  current,
  flashcardAnswer,
  flashcardHint,
  readingInput,
  readingInputScript,
  readingFeedback,
  gridFilteredData,
  gridSearch,
  gridStatusFilter,
  helpOpen,
  knownCount,
  mode,
  quizAnswered,
  quizFeedback,
  quizOptions,
  readingsFoundCount,
  readingsOverallFoundCount,
  readingsOverallCount,
  readingsTotalCount,
  requireAllReadings,
  selectedOption,
  sessionRate,
  sessionStats,
  sessionSummary,
  shuffleEnabled,
  sourceLabel,
  totalCount,
  unknownCount,
} = storeToRefs(store);

const isFlashcard = computed(() => mode.value === 'flashcard');
const currentKanji = computed(() => (current.value ? current.value.kanji : '-'));
const currentMeaning = computed(() => (current.value ? current.value.meaning : ''));
const transitionDirection = ref(1);
const currentPath = ref(getCurrentPath());
const isCountingRoute = computed(() => currentPath.value === '/counting');
const isTeFormRoute = computed(() => currentPath.value === '/te-form');
const isKanjiRoute = computed(() => !isCountingRoute.value && !isTeFormRoute.value);

function moveCardWithDirection(delta) {
  transitionDirection.value = delta < 0 ? -1 : 1;
  store.moveCard(delta);
}

function handleKeydown(event) {
  if (!isKanjiRoute.value) return;

  if (event.altKey || event.ctrlKey || event.metaKey) return;

  const targetTag = event.target && event.target.tagName;
  if (targetTag === 'INPUT' || targetTag === 'SELECT' || targetTag === 'TEXTAREA' || targetTag === 'BUTTON') {
    return;
  }

  if (event.key === 'Escape') {
    store.hideHelpTooltip();
    store.hideFeedbackPanels();
    return;
  }

  if (mode.value === 'quiz' && !quizAnswered.value && /^[1-4]$/.test(event.key)) {
    const optionIndex = Number(event.key) - 1;
    const option = quizOptions.value[optionIndex];
    if (option) {
      store.answerQuiz(option);
    }
    return;
  }

  if (mode.value === 'quiz' && quizAnswered.value && event.key === 'Enter') {
    moveCardWithDirection(1);
    return;
  }

  if (event.key === 'ArrowLeft') {
    moveCardWithDirection(-1);
  } else if (event.key === 'ArrowRight') {
    moveCardWithDirection(1);
  }
}

function handleOutsideClick(event) {
  if (!isKanjiRoute.value) return;
  if (!helpOpen.value) return;

  const helpWrap = event.target.closest('[data-help-wrap]');
  if (!helpWrap) {
    store.hideHelpTooltip();
  }
}

function navigate(path) {
  const target = ['/counting', '/te-form'].includes(path) ? path : '/';
  if (target === currentPath.value) return;

  window.history.pushState({}, '', target);
  currentPath.value = target;
}

function handlePopState() {
  currentPath.value = getCurrentPath();
}

onMounted(() => {
  const redirectedPath = new URLSearchParams(window.location.search).get('p');
  if (['/counting', '/te-form'].includes(redirectedPath) && window.location.pathname !== redirectedPath) {
    window.history.replaceState({}, '', redirectedPath);
    currentPath.value = redirectedPath;
  }

  store.init();
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('click', handleOutsideClick);
  window.addEventListener('popstate', handlePopState);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('click', handleOutsideClick);
  window.removeEventListener('popstate', handlePopState);
});
</script>

<template>
  <main class="mx-auto w-[min(1100px,calc(100%-32px))] py-8 text-slate-100 md:py-10">
    <PracticeRouteTabs :current-path="currentPath" @navigate="navigate" />

    <CountingPracticeView v-if="isCountingRoute" />
    <TeFormPracticeView v-else-if="isTeFormRoute" />

    <template v-else>
      <HeroHeader
        :session-summary="sessionSummary"
        :total-count="totalCount"
        :known-count="knownCount"
        :unknown-count="unknownCount"
        :help-open="helpOpen"
        @toggle-help="store.toggleHelpTooltip"
      />

      <StudyToolbar
        :is-flashcard="isFlashcard"
        @set-mode="store.setMode"
        @reset-progress="store.resetProgress"
      />

      <SessionMetrics
        :session-stats="sessionStats"
        :session-rate="sessionRate"
      />

      <FlashcardPanel
        v-if="isFlashcard"
        :card-position="cardPosition"
        :source-label="sourceLabel"
        :current-kanji="currentKanji"
        :flashcard-hint="flashcardHint"
        :flashcard-answer="flashcardAnswer"
        :reading-input="readingInput"
        :reading-input-script="readingInputScript"
        :reading-feedback="readingFeedback"
        :require-all-readings="requireAllReadings"
        :readings-total-count="readingsTotalCount"
        :readings-found-count="readingsFoundCount"
        :readings-overall-found-count="readingsOverallFoundCount"
        :readings-overall-count="readingsOverallCount"
        :shuffle-enabled="shuffleEnabled"
        :transition-direction="transitionDirection"
        @set-shuffle="store.setShuffle"
        @set-require-all-readings="store.setRequireAllReadings"
        @set-reading-input-script="store.setReadingInputScript"
        @show-hint="store.showFlashcardHint"
        @show-answer="store.showFlashcardAnswer"
        @update-reading="store.setReadingInput"
        @submit-reading="store.submitReadingAttempt"
        @move-prev="moveCardWithDirection(-1)"
        @move-next="moveCardWithDirection(1)"
      />

      <QuizPanel
        v-else
        :card-position="cardPosition"
        :source-label="sourceLabel"
        :current-kanji="currentKanji"
        :quiz-options="quizOptions"
        :quiz-answered="quizAnswered"
        :quiz-feedback="quizFeedback"
        :selected-option="selectedOption"
        :correct-meaning="currentMeaning"
        :shuffle-enabled="shuffleEnabled"
        :transition-direction="transitionDirection"
        @set-shuffle="store.setShuffle"
        @answer="store.answerQuiz"
        @show-hint="store.showQuizHint"
        @next="moveCardWithDirection(1)"
      />

      <KanjiGridPanel
        :grid-search="gridSearch"
        :grid-status-filter="gridStatusFilter"
        :grid-filtered-data="gridFilteredData"
        :get-progress-state="store.getProgressState"
        @update:grid-search="store.gridSearch = $event"
        @update:grid-status="store.gridStatusFilter = $event"
      />
    </template>
  </main>
</template>
