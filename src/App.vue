<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import HeroHeader from './components/HeroHeader.vue';
import StudyToolbar from './components/StudyToolbar.vue';
import SessionMetrics from './components/SessionMetrics.vue';
import FlashcardPanel from './components/FlashcardPanel.vue';
import QuizPanel from './components/QuizPanel.vue';
import KanjiGridPanel from './components/KanjiGridPanel.vue';
import { useStudyStore } from './stores/useStudyStore';

const store = useStudyStore();
const {
  cardPosition,
  current,
  flashcardAnswer,
  flashcardHint,
  readingInput,
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

function handleKeydown(event) {
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
    store.moveCard(1);
    return;
  }

  if (event.key === 'ArrowLeft') {
    store.moveCard(-1);
  } else if (event.key === 'ArrowRight') {
    store.moveCard(1);
  }
}

function handleOutsideClick(event) {
  if (!helpOpen.value) return;

  const helpWrap = event.target.closest('[data-help-wrap]');
  if (!helpWrap) {
    store.hideHelpTooltip();
  }
}

onMounted(() => {
  store.init();
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<template>
  <main class="mx-auto w-[min(1100px,calc(100%-32px))] py-8 text-slate-100 md:py-10">
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
      :reading-feedback="readingFeedback"
      :shuffle-enabled="shuffleEnabled"
      @set-shuffle="store.setShuffle"
      @show-hint="store.showFlashcardHint"
      @show-answer="store.showFlashcardAnswer"
      @update-reading="store.setReadingInput"
      @submit-reading="store.submitReadingAttempt"
      @move-prev="store.moveCard(-1)"
      @move-next="store.moveCard(1)"
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
      @set-shuffle="store.setShuffle"
      @answer="store.answerQuiz"
      @show-hint="store.showQuizHint"
      @next="store.moveCard(1)"
    />

    <KanjiGridPanel
      :grid-search="gridSearch"
      :grid-status-filter="gridStatusFilter"
      :grid-filtered-data="gridFilteredData"
      :get-progress-state="store.getProgressState"
      @update:grid-search="store.gridSearch = $event"
      @update:grid-status="store.gridStatusFilter = $event"
    />
  </main>
</template>
