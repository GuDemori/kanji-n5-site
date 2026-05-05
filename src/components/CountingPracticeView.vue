<script setup>
import CheckAnswerButton from './CheckAnswerButton.vue';
import { computed } from 'vue';
import BaseSelect from './BaseSelect.vue';
import KanaInput from './KanaInput.vue';
import PracticePromptCard from './PracticePromptCard.vue';
import SessionMetrics from './SessionMetrics.vue';
import { useI18n } from '../i18n';
import { useCountingPractice } from '../composables/useCountingPractice';

const { t } = useI18n();
const {
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
} = useCountingPractice();

const glossaryOptions = computed(() => [
  { value: 'all', label: t('counting.glossaryAllTypes') },
  ...typeOptions.value,
]);
</script>

<template>
  <section class="mb-5 rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-slate-50">{{ t('counting.title') }}</h2>
        <p class="text-slate-400">{{ t('counting.subtitle') }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <label class="inline-flex items-center gap-2 text-sm text-slate-200 select-none">
          <span class="font-semibold">{{ t('counting.shuffle') }}</span>
          <input
            type="checkbox"
            class="peer sr-only"
            :checked="shuffleEnabled"
            @change="onShuffleChange($event.target.checked)"
          >
          <span
            class="relative h-6 w-11 rounded-full bg-slate-700/80 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-sky-500/70 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sky-300"
            aria-hidden="true"
          />
        </label>

        <label class="inline-flex items-center gap-2 text-sm text-slate-200 select-none">
          <span class="font-semibold">{{ t('counting.sequential') }}</span>
          <input
            type="checkbox"
            class="peer sr-only"
            :checked="sequentialEnabled"
            @change="onSequentialChange($event.target.checked)"
          >
          <span
            class="relative h-6 w-11 rounded-full bg-slate-700/80 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-sky-500/70 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sky-300"
            aria-hidden="true"
          />
        </label>
      </div>
    </div>

    <SessionMetrics :session-stats="stats" :session-rate="sessionRate" />

    <section class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div class="mb-4 grid gap-3 md:grid-cols-[1fr_280px]">
        <div class="rounded-xl border border-white/10 bg-slate-900/70 p-4">
          <p class="text-xs uppercase tracking-wide text-slate-400">{{ t('counting.countingType') }}</p>
          <p class="mt-1 text-sm text-sky-200">{{ currentTypeLabel }}</p>
        </div>

        <div class="rounded-xl border border-white/10 bg-slate-900/70 p-4">
          <BaseSelect
            :model-value="selectedType"
            :label="t('counting.selectType')"
            :options="typeOptions"
            @update:model-value="onTypeChange"
          />
        </div>
      </div>

      <PracticePromptCard
        :label="t('counting.numberPrompt')"
        :value="currentPrompt.counterLabel"
      />

      <div class="grid gap-2 md:grid-cols-[1fr_220px_220px]">
        <KanaInput
          :model-value="answerInput"
          :placeholder="t('counting.inputPlaceholder')"
          @update:model-value="setInput"
          @enter="submitAnswer"
        />
        <CheckAnswerButton :label="t('counting.check')" @click="submitAnswer" />
        <button type="button" class="action-ghost" @click="nextPrompt">{{ t('counting.next') }}</button>
      </div>

      <div v-if="feedback" class="mt-4 whitespace-pre-line rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
        {{ feedback }}
      </div>
    </section>

    <section class="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div class="mb-4 grid gap-3 sm:grid-cols-[1fr_260px]">
        <div>
          <h3 class="text-xl font-bold text-slate-100">{{ t('counting.glossaryTitle') }}</h3>
          <p class="text-sm text-slate-400">{{ t('counting.glossarySubtitle') }}</p>
        </div>

        <BaseSelect
          v-model="glossaryType"
          :label="t('counting.glossaryFilterLabel')"
          :options="glossaryOptions"
        />
      </div>

      <p class="mb-3 text-sm text-slate-400">{{ t('counting.glossaryCount', { count: glossaryRows.length }) }}</p>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="row in glossaryRows"
          :key="row.id"
          class="rounded-2xl border border-white/10 bg-slate-900/70 p-4"
        >
          <p class="text-xs uppercase tracking-wide text-slate-400">{{ row.typeLabel }}</p>
          <p class="mt-2 text-3xl font-bold text-slate-100">{{ row.expression }}</p>
          <p class="mt-1 text-sky-200">{{ row.reading }}</p>
        </article>
      </div>
    </section>
  </section>
</template>
