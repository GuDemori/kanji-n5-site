<script setup>
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
          <label class="text-sm text-slate-300">
            {{ t('counting.selectType') }}
            <select
              :value="selectedType"
              class="mt-1 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100"
              @change="onTypeChange($event.target.value)"
            >
              <option v-for="option in typeOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </label>
        </div>
      </div>

      <div class="mb-3 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 text-center">
        <p class="text-xs uppercase tracking-wide text-slate-400">{{ t('counting.numberPrompt') }}</p>
        <p class="mt-2 text-5xl font-bold text-slate-50">{{ currentPrompt.counterLabel }}</p>
      </div>

      <div class="grid gap-2 md:grid-cols-[1fr_220px_220px]">
        <input
          :value="answerInput"
          type="text"
          :placeholder="t('counting.inputPlaceholder')"
          lang="ja"
          class="w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100"
          @input="setInput($event.target.value)"
          @keyup.enter="submitAnswer"
        >
        <button type="button" class="action-main" @click="submitAnswer">{{ t('counting.check') }}</button>
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

        <label class="text-sm text-slate-300">
          {{ t('counting.glossaryFilterLabel') }}
          <select
            :value="glossaryType"
            class="mt-1 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100"
            @change="glossaryType = $event.target.value"
          >
            <option value="all">{{ t('counting.glossaryAllTypes') }}</option>
            <option v-for="option in typeOptions" :key="`glossary-${option.value}`" :value="option.value">{{ option.label }}</option>
          </select>
        </label>
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
