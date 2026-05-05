<script setup>
import CheckAnswerButton from './CheckAnswerButton.vue';
import { computed } from 'vue';
import BaseSelect from './BaseSelect.vue';
import KanaInput from './KanaInput.vue';
import PracticePromptCard from './PracticePromptCard.vue';
import SessionMetrics from './SessionMetrics.vue';
import { useI18n } from '../i18n';
import { useTeFormPractice } from '../composables/useTeFormPractice';

const { t } = useI18n();
const {
  verbList,
  currentVerb,
  lessonOptions,
  invertedEnabled,
  teFormEnabled,
  translationEnabled,
  teFormInput,
  translationInput,
  teFormInputScript,
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
  setBaseVerbInput,
  setInvertedEnabled,
  setTeFormEnabled,
  setTranslationEnabled,
  setPracticeLessonFilter,
} = useTeFormPractice();

const filterOptions = computed(() => [
  { value: 'verb', label: t('teForm.searchFilterVerb') },
  { value: 'translation', label: t('teForm.searchFilterTranslation') },
]);
</script>

<template>
  <section class="mb-5 rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
    <div class="mb-4">
      <h2 class="text-2xl font-bold text-slate-50">{{ t('teForm.title') }}</h2>
      <p class="text-slate-400">{{ t('teForm.subtitle') }}</p>
    </div>

    <SessionMetrics :session-stats="stats" :session-rate="sessionRate" />

    <section class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div class="mb-4 grid gap-3 lg:grid-cols-[minmax(0,416px)_1fr]">
        <BaseSelect
          :model-value="practiceLessonFilter"
          :label="t('teForm.practiceLessonFilterLabel')"
          :options="lessonOptions"
          @update:model-value="setPracticeLessonFilter"
        />

        <div class="flex flex-wrap items-center gap-4 lg:justify-end">
          <label v-if="!invertedEnabled" class="inline-flex items-center gap-2 text-sm text-slate-200 select-none">
            <span class="font-semibold">{{ t('teForm.answerTeForm') }}</span>
            <input
              type="checkbox"
              class="peer sr-only"
              :checked="teFormEnabled"
              @change="setTeFormEnabled($event.target.checked)"
            >
            <span
              class="relative h-6 w-11 rounded-full bg-slate-700/80 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-sky-500/70 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sky-300"
              aria-hidden="true"
            />
          </label>

          <label v-if="!invertedEnabled" class="inline-flex items-center gap-2 text-sm text-slate-200 select-none">
            <span class="font-semibold">{{ t('teForm.answerTranslation') }}</span>
            <input
              type="checkbox"
              class="peer sr-only"
              :checked="translationEnabled"
              @change="setTranslationEnabled($event.target.checked)"
            >
            <span
              class="relative h-6 w-11 rounded-full bg-slate-700/80 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-sky-500/70 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sky-300"
              aria-hidden="true"
            />
          </label>

          <label class="inline-flex items-center gap-2 text-sm text-slate-200 select-none">
            <span class="font-semibold">{{ t('teForm.invertPractice') }}</span>
            <input
              type="checkbox"
              class="peer sr-only"
              :checked="invertedEnabled"
              @change="setInvertedEnabled($event.target.checked)"
            >
            <span
              class="relative h-6 w-11 rounded-full bg-slate-700/80 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-sky-500/70 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sky-300"
              aria-hidden="true"
            />
          </label>
        </div>
      </div>

      <PracticePromptCard
        v-if="currentVerb"
        :label="t(invertedEnabled ? 'teForm.translationPromptLabel' : 'teForm.promptLabel')"
        :value="invertedEnabled ? currentVerb.translation : currentVerb.verb"
        :meta="currentVerb.lesson"
        :variant="invertedEnabled ? 'compact' : 'default'"
      />

      <div class="grid gap-3" :class="invertedEnabled ? '' : 'md:grid-cols-2'">
        <label v-if="!invertedEnabled" class="text-sm text-slate-300">
          {{ t('teForm.teFormLabel') }}
          <KanaInput
            :model-value="teFormInput"
            :disabled="!teFormEnabled"
            :placeholder="teFormInputScript === 'katakana' ? t('flashcard.inputKatakanaPlaceholder') : t('teForm.teFormPlaceholder')"
            :show-script-toggle="true"
            :switch-title="teFormInputScript === 'katakana' ? t('flashcard.switchToHiragana') : t('flashcard.switchToKatakana')"
            class="mt-1"
            @update:model-value="setTeFormInput"
            @toggle-script="toggleTeFormInputScript"
            @enter="submitAnswer"
          />
        </label>

        <label class="text-sm text-slate-300">
          {{ t(invertedEnabled ? 'teForm.baseVerbLabel' : 'teForm.translationLabel') }}
          <KanaInput
            v-if="invertedEnabled"
            :model-value="translationInput"
            :placeholder="t('teForm.baseVerbPlaceholder')"
            class="mt-1"
            @update:model-value="setBaseVerbInput"
            @enter="submitAnswer"
          />
          <input
            v-else
            v-model="translationInput"
            type="text"
            :disabled="!translationEnabled"
            :placeholder="t('teForm.translationPlaceholder')"
            class="mt-1 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            @keyup.enter="submitAnswer"
          >
        </label>
      </div>

      <div class="mt-3 grid gap-2 md:grid-cols-[1fr_220px]">
        <CheckAnswerButton :label="t('teForm.check')" @click="submitAnswer" />
        <button type="button" class="action-ghost" @click="nextVerb">{{ t('teForm.next') }}</button>
      </div>

      <div
        v-if="feedback"
        class="mt-4 whitespace-pre-line rounded-2xl border p-4 text-slate-200"
        :class="{
          'border-emerald-400/30 bg-emerald-500/10': feedbackState === 'correct',
          'border-rose-400/30 bg-rose-500/10': feedbackState === 'wrong',
          'border-amber-300/30 bg-amber-400/10': feedbackState === 'warning',
        }"
      >
        {{ feedback }}
      </div>

      <div
        v-if="!currentVerb"
        class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-slate-400"
      >
        {{ t('teForm.noPracticeResults') }}
      </div>
    </section>

    <section class="mt-5 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <h3 class="text-xl font-bold text-slate-100">{{ t('teForm.rulesTitle') }}</h3>

      <div class="mt-3 grid gap-3 lg:grid-cols-3">
        <article class="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
          <h4 class="text-lg font-bold text-slate-100">{{ t('teForm.rules.group1.title') }}</h4>
          <div class="mt-3 space-y-4">
            <div>
              <p class="font-semibold text-slate-100">{{ t('teForm.rules.group1.iChRi') }}</p>
              <p>かいます -> かって</p>
              <p>まちます -> まって</p>
              <p>かえります -> かえって</p>
            </div>
            <div>
              <p class="font-semibold text-slate-100">{{ t('teForm.rules.group1.miBiNi') }}</p>
              <p>のみます -> のんで</p>
              <p>よびます -> よんで</p>
              <p>しにます -> しんで</p>
            </div>
            <div>
              <p class="font-semibold text-slate-100">{{ t('teForm.rules.group1.ki') }}</p>
              <p>かきます -> かいて</p>
            </div>
            <div>
              <p class="font-semibold text-slate-100">{{ t('teForm.rules.group1.gi') }}</p>
              <p>いそぎます -> いそいで</p>
            </div>
            <div>
              <p class="font-semibold text-slate-100">{{ t('teForm.rules.group1.shi') }}</p>
              <p>はなします -> はなして</p>
            </div>
            <div>
              <p class="font-semibold text-slate-100">{{ t('teForm.rules.exception') }}</p>
              <p>いきます -> いって</p>
            </div>
          </div>
        </article>

        <article class="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
          <h4 class="text-lg font-bold text-slate-100">{{ t('teForm.rules.group2.title') }}</h4>
          <p class="mt-3">{{ t('teForm.rules.group2.description') }}</p>
          <div class="mt-3 space-y-1">
            <p>たべます -> たべて</p>
            <p>みます -> みて</p>
            <p>あけます -> あけて</p>
          </div>
        </article>

        <article class="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
          <h4 class="text-lg font-bold text-slate-100">{{ t('teForm.rules.group3.title') }}</h4>
          <p class="mt-3">{{ t('teForm.rules.group3.irregular') }}</p>
          <div class="mt-3 space-y-1">
            <p>します -> して</p>
            <p>きます -> きて</p>
          </div>
          <p class="mt-4">{{ t('teForm.rules.group3.compound') }}</p>
          <div class="mt-3 space-y-1">
            <p>べんきょうします -> べんきょうして</p>
            <p>けんきゅうします -> けんきゅうして</p>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-5 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <h3 class="text-xl font-bold text-slate-100">{{ t('teForm.usesTitle') }}</h3>
      <div class="mt-3 grid gap-3 md:grid-cols-2">
        <article v-for="use in t('teForm.uses').split('|')" :key="use" class="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
          <p class="whitespace-pre-line">{{ use }}</p>
        </article>
      </div>
    </section>

    <section class="mt-5 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <h3 class="text-xl font-bold text-slate-100">{{ t('teForm.fullListTitle') }}</h3>
      <p class="mt-1 text-sm text-slate-400">{{ t('teForm.fullListCount', { count: filteredVerbList.length }) }}</p>

      <div class="mt-4 grid gap-3 lg:grid-cols-[1fr_220px_220px]">
        <label class="text-sm text-slate-300">
          {{ t('teForm.searchLabel') }}
          <input
            v-model="verbListSearch"
            type="search"
            :placeholder="t('teForm.searchPlaceholder')"
            class="mt-1 w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-slate-100"
          >
        </label>

        <BaseSelect
          v-model="verbListFilter"
          :label="t('teForm.searchFilterLabel')"
          :options="filterOptions"
        />

        <BaseSelect
          v-model="verbListLessonFilter"
          :label="t('teForm.listLessonFilterLabel')"
          :options="lessonOptions"
        />
      </div>

      <div class="mt-4 space-y-4" v-if="filteredVerbList.length">
        <section
          v-for="group in groupedFilteredVerbList"
          :key="group.lesson"
          class="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <h4 class="text-lg font-bold text-slate-100">{{ group.lesson }}</h4>
          <div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="verb in group.items"
              :key="verb.id"
              class="rounded-xl border border-white/10 bg-slate-950/50 p-4 text-base text-slate-300"
            >
              <p class="font-semibold leading-relaxed text-slate-100">{{ verb.verb }} -> {{ verb.teForm }} -> {{ verb.translation }}</p>
            </article>
          </div>
        </section>
      </div>

      <article
        v-else
        class="mt-3 rounded-xl border border-white/10 bg-white/5 p-4 text-center text-slate-400"
      >
        {{ t('teForm.noResults') }}
      </article>
    </section>
  </section>
</template>
