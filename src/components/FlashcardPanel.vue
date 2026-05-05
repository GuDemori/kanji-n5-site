<script setup>
import CheckAnswerButton from './CheckAnswerButton.vue';
import KanaInput from './KanaInput.vue';
import PracticePromptCard from './PracticePromptCard.vue';
import { useI18n } from '../i18n';

defineProps({
  cardPosition: {
    type: String,
    required: true,
  },
  sourceLabel: {
    type: String,
    required: true,
  },
  currentKanji: {
    type: String,
    required: true,
  },
  flashcardHint: {
    type: String,
    required: true,
  },
  flashcardAnswer: {
    type: Object,
    default: null,
  },
  shuffleEnabled: {
    type: Boolean,
    required: true,
  },
  readingInput: {
    type: String,
    required: true,
  },
  readingInputScript: {
    type: String,
    default: 'hiragana',
  },
  readingFeedback: {
    type: String,
    required: true,
  },
  requireAllReadings: {
    type: Boolean,
    default: false,
  },
  readingsTotalCount: {
    type: Number,
    default: 0,
  },
  readingsFoundCount: {
    type: Number,
    default: 0,
  },
  readingsOverallFoundCount: {
    type: Number,
    default: 0,
  },
  readingsOverallCount: {
    type: Number,
    default: 0,
  },
  transitionDirection: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits([
  'show-hint',
  'show-answer',
  'move-prev',
  'move-next',
  'set-shuffle',
  'set-require-all-readings',
  'set-reading-input-script',
  'update-reading',
  'submit-reading',
]);

const { t } = useI18n();
</script>

<template>
  <section class="mb-5 rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm">
      <div class="flex flex-wrap gap-2">
        <span class="rounded-full bg-sky-400/15 px-3 py-1 text-sky-200">{{ cardPosition }}</span>
        <span class="rounded-full bg-white/10 px-3 py-1 text-slate-300">{{ sourceLabel }}</span>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <label class="inline-flex items-center gap-2 text-sm text-slate-200 select-none">
          <span class="font-semibold">{{ t('flashcard.shuffle') }}</span>
          <input
            type="checkbox"
            class="peer sr-only"
            :checked="shuffleEnabled"
            @change="emit('set-shuffle', $event.target.checked)"
          >
          <span
            class="relative h-6 w-11 rounded-full bg-slate-700/80 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-sky-500/70 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sky-300"
            aria-hidden="true"
          />
        </label>

        <label class="inline-flex items-center gap-2 text-sm text-slate-200 select-none">
          <span class="font-semibold">{{ t('flashcard.fullTraining') }}</span>
          <input
            type="checkbox"
            class="peer sr-only"
            :checked="requireAllReadings"
            @change="emit('set-require-all-readings', $event.target.checked)"
          >
          <span
            class="relative h-6 w-11 rounded-full bg-slate-700/80 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-sky-500/70 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sky-300"
            aria-hidden="true"
          />
        </label>
      </div>
    </div>

    <Transition :name="transitionDirection < 0 ? 'card-roulette-up' : 'card-roulette-down'" mode="out-in">
      <PracticePromptCard
        :key="currentKanji"
        :value="currentKanji"
        variant="kanji"
        class="mb-4"
      />
    </Transition>

    <div class="grid gap-3 lg:grid-cols-3">
      <div class="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col">
        <p class="mb-2 text-xs uppercase tracking-wide text-slate-400">{{ t('flashcard.reveal') }}</p>
        <div class="grid flex-1 grid-rows-2 gap-2">
          <button type="button" class="action-ghost h-full" @click="emit('show-hint')">{{ t('flashcard.showHint') }}</button>
          <button type="button" class="action-main h-full" @click="emit('show-answer')">{{ t('flashcard.showAnswer') }}</button>
        </div>
      </div>

      <div class="rounded-xl border border-white/10 bg-white/5 p-3">
        <p class="mb-2 text-xs uppercase tracking-wide text-slate-400">{{ t('flashcard.reading') }}</p>
        <div class="grid gap-2">
          <KanaInput
            :model-value="readingInput"
            :placeholder="readingInputScript === 'katakana' ? t('flashcard.inputKatakanaPlaceholder') : t('flashcard.inputHiraganaPlaceholder')"
            :show-script-toggle="true"
            :switch-title="readingInputScript === 'katakana' ? t('flashcard.switchToHiragana') : t('flashcard.switchToKatakana')"
            @update:model-value="emit('update-reading', $event)"
            @toggle-script="emit('set-reading-input-script', readingInputScript === 'katakana' ? 'hiragana' : 'katakana')"
            @enter="emit('submit-reading')"
          />
          <CheckAnswerButton :label="t('flashcard.submitReading')" @click="emit('submit-reading')" />
        </div>
      </div>

      <div class="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col">
        <p class="mb-2 text-xs uppercase tracking-wide text-slate-400">{{ t('flashcard.navigation') }}</p>
        <div class="grid flex-1 grid-rows-2 gap-2">
          <button type="button" class="action-ghost h-full" @click="emit('move-prev')">{{ t('flashcard.previous') }}</button>
          <button type="button" class="action-main h-full" @click="emit('move-next')">{{ t('flashcard.next') }}</button>
        </div>
      </div>
    </div>

    <div v-if="requireAllReadings" class="mt-4 rounded-xl border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-sm text-sky-100">
      {{ t('flashcard.fullTrainingStatus', {
        found: readingsFoundCount,
        total: readingsTotalCount,
        script: readingInputScript === 'katakana' ? t('flashcard.scriptOn') : t('flashcard.scriptKun'),
      }) }}
      {{ t('flashcard.fullTrainingTotal', {
        found: readingsOverallFoundCount,
        total: readingsOverallCount,
      }) }}
    </div>

    <div v-if="readingFeedback" class="mt-4 whitespace-pre-line rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
      {{ readingFeedback }}
    </div>

    <div v-if="flashcardHint" class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
      {{ flashcardHint }}
    </div>

    <div v-if="flashcardAnswer" class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
      <strong class="block text-lg">{{ flashcardAnswer.title }}</strong>
      <p class="mt-2">{{ t('flashcard.acceptedReadings') }} {{ flashcardAnswer.reading }}</p>
      <p class="mt-1">{{ flashcardAnswer.source }}</p>
    </div>
  </section>
</template>
