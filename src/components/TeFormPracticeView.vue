<script setup>
import CheckAnswerButton from './CheckAnswerButton.vue';
import { computed, ref } from 'vue';
import BaseSelect from './BaseSelect.vue';
import KanaInput from './KanaInput.vue';
import PracticePromptCard from './PracticePromptCard.vue';
import SessionMetrics from './SessionMetrics.vue';
import arrowDownIcon from '../arrow-down.svg';
import { useI18n } from '../i18n';
import { useTeFormPractice } from '../composables/useTeFormPractice';

const { t } = useI18n();
const {
  verbList,
  currentVerb,
  lessonOptions,
  conjugationType,
  conjugationTypeOptions,
  conjugationLabel,
  conjugationPlaceholder,
  answerConjugationLabel,
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
  getDisplayConjugation,
  setConjugationType,
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
const rulesExpanded = ref(true);
const usesExpanded = ref(true);

const useCards = computed(() => t(conjugationType.value === 'nai' ? 'teForm.naiUses' : 'teForm.uses')
  .split('|')
  .map(use => {
    const [title, structure, phrase, ...meaningLines] = use.split('\n');
    return {
      title,
      structure,
      phrase,
      meaning: meaningLines.join('\n'),
    };
  }));
</script>

<template>
  <section class="mb-5 rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
    <div class="mb-4">
      <h2 class="text-2xl font-bold text-slate-50">{{ t('teForm.title') }}</h2>
      <p class="text-slate-400">{{ t('teForm.subtitle') }}</p>
    </div>

    <SessionMetrics :session-stats="stats" :session-rate="sessionRate" />

    <section class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div class="mb-4 grid gap-3 md:grid-cols-2">
        <BaseSelect
          :model-value="conjugationType"
          :label="t('teForm.conjugationTypeLabel')"
          :options="conjugationTypeOptions"
          @update:model-value="setConjugationType"
        />

        <BaseSelect
          :model-value="practiceLessonFilter"
          :label="t('teForm.practiceLessonFilterLabel')"
          :options="lessonOptions"
          @update:model-value="setPracticeLessonFilter"
        />
      </div>

      <div class="mb-4 flex flex-wrap items-center gap-4">
        <label v-if="!invertedEnabled" class="inline-flex items-center gap-2 text-sm text-slate-200 select-none">
          <span class="font-semibold">{{ answerConjugationLabel }}</span>
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

      <PracticePromptCard
        v-if="currentVerb"
        :label="t(invertedEnabled ? 'teForm.translationPromptLabel' : 'teForm.promptLabel')"
        :value="invertedEnabled ? currentVerb.translation : currentVerb.verb"
        :meta="currentVerb.lesson"
        :variant="invertedEnabled ? 'compact' : 'default'"
      />

      <div class="grid gap-3" :class="invertedEnabled ? '' : 'md:grid-cols-2'">
        <label v-if="!invertedEnabled" class="text-sm text-slate-300">
          {{ conjugationLabel }}
          <KanaInput
            :model-value="teFormInput"
            :disabled="!teFormEnabled"
            :placeholder="teFormInputScript === 'katakana' ? t('flashcard.inputKatakanaPlaceholder') : conjugationPlaceholder"
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

    <section class="mt-5 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <button
        type="button"
        class="flex w-full items-center justify-between gap-3 rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
        :aria-expanded="String(rulesExpanded)"
        @click="rulesExpanded = !rulesExpanded"
      >
        <span class="text-2xl font-bold text-slate-100">{{ t(conjugationType === 'nai' ? 'teForm.naiRulesTitle' : 'teForm.teRulesTitle') }}</span>
        <img
          :src="arrowDownIcon"
          alt=""
          class="h-5 w-5 shrink-0 brightness-0 invert transition-transform"
          :class="rulesExpanded ? '' : '-rotate-90'"
          aria-hidden="true"
        >
      </button>

      <div
        v-if="rulesExpanded"
        class="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-slate-300"
      >
        <div class="flex flex-col gap-3 lg:flex-row lg:items-start">
          <div class="shrink-0 lg:w-44">
            <h4 class="text-base font-bold text-slate-100">{{ t('teForm.groupGuideTitle') }}</h4>
            <p class="mt-1 text-slate-400">{{ t('teForm.groupGuideIntro') }}</p>
          </div>
          <div class="grid flex-1 gap-2 md:grid-cols-3">
            <p><span class="font-bold text-sky-100">{{ t('teForm.rules.group1.title') }}:</span> {{ t('teForm.groupGuide.group1') }}</p>
            <p><span class="font-bold text-sky-100">{{ t('teForm.rules.group2.title') }}:</span> {{ t('teForm.groupGuide.group2') }}</p>
            <p><span class="font-bold text-sky-100">{{ t('teForm.rules.group3.title') }}:</span> {{ t('teForm.groupGuide.group3') }}</p>
          </div>
        </div>
      </div>

      <div v-if="rulesExpanded && conjugationType === 'te'" class="mt-3 grid gap-3 lg:grid-cols-3">
        <article class="rounded-xl border border-white/10 bg-white/5 p-4 text-base leading-relaxed text-slate-300">
          <h4 class="text-xl font-bold text-slate-100">{{ t('teForm.rules.group1.title') }}</h4>
          <div class="mt-3 space-y-4">
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-sky-200">{{ t('teForm.ruleLabel') }}</p>
              <p class="font-semibold text-slate-100">{{ t('teForm.rules.group1.iChRi') }}</p>
              <p class="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.examplesLabel') }}</p>
              <div class="mt-1 space-y-1 font-semibold text-slate-100">
                <p>かいます -> かって</p>
                <p>まちます -> まって</p>
                <p>かえります -> かえって</p>
              </div>
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-sky-200">{{ t('teForm.ruleLabel') }}</p>
              <p class="font-semibold text-slate-100">{{ t('teForm.rules.group1.miBiNi') }}</p>
              <p class="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.examplesLabel') }}</p>
              <div class="mt-1 space-y-1 font-semibold text-slate-100">
                <p>のみます -> のんで</p>
                <p>よびます -> よんで</p>
                <p>しにます -> しんで</p>
              </div>
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-sky-200">{{ t('teForm.ruleLabel') }}</p>
              <p class="font-semibold text-slate-100">{{ t('teForm.rules.group1.ki') }}</p>
              <p class="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.examplesLabel') }}</p>
              <p class="mt-1 font-semibold text-slate-100">かきます -> かいて</p>
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-sky-200">{{ t('teForm.ruleLabel') }}</p>
              <p class="font-semibold text-slate-100">{{ t('teForm.rules.group1.gi') }}</p>
              <p class="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.examplesLabel') }}</p>
              <p class="mt-1 font-semibold text-slate-100">いそぎます -> いそいで</p>
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-sky-200">{{ t('teForm.ruleLabel') }}</p>
              <p class="font-semibold text-slate-100">{{ t('teForm.rules.group1.shi') }}</p>
              <p class="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.examplesLabel') }}</p>
              <p class="mt-1 font-semibold text-slate-100">はなします -> はなして</p>
            </div>
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-amber-200">{{ t('teForm.exceptionLabel') }}</p>
              <p class="mt-1 font-semibold text-slate-100">いきます -> いって</p>
            </div>
          </div>
        </article>

        <article class="rounded-xl border border-white/10 bg-white/5 p-4 text-base leading-relaxed text-slate-300">
          <h4 class="text-xl font-bold text-slate-100">{{ t('teForm.rules.group2.title') }}</h4>
          <p class="mt-3 text-xs font-bold uppercase tracking-wide text-sky-200">{{ t('teForm.ruleLabel') }}</p>
          <p class="font-semibold text-slate-100">{{ t('teForm.rules.group2.description') }}</p>
          <p class="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.examplesLabel') }}</p>
          <div class="mt-2 space-y-1 font-semibold text-slate-100">
            <p>たべます -> たべて</p>
            <p>みます -> みて</p>
            <p>あけます -> あけて</p>
          </div>
        </article>

        <article class="rounded-xl border border-white/10 bg-white/5 p-4 text-base leading-relaxed text-slate-300">
          <h4 class="text-xl font-bold text-slate-100">{{ t('teForm.rules.group3.title') }}</h4>
          <p class="mt-3 text-xs font-bold uppercase tracking-wide text-sky-200">{{ t('teForm.ruleLabel') }}</p>
          <p class="font-semibold text-slate-100">{{ t('teForm.rules.group3.irregular') }}</p>
          <p class="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.examplesLabel') }}</p>
          <div class="mt-1 space-y-1 font-semibold text-slate-100">
            <p>します -> して</p>
            <p>きます -> きて</p>
          </div>
          <p class="mt-4 text-xs font-bold uppercase tracking-wide text-sky-200">{{ t('teForm.ruleLabel') }}</p>
          <p class="font-semibold text-slate-100">{{ t('teForm.rules.group3.compound') }}</p>
          <p class="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.examplesLabel') }}</p>
          <div class="mt-1 space-y-1 font-semibold text-slate-100">
            <p>べんきょうします -> べんきょうして</p>
            <p>けんきゅうします -> けんきゅうして</p>
          </div>
        </article>
      </div>

      <div v-if="rulesExpanded && conjugationType === 'nai'" class="mt-3 grid gap-3 lg:grid-cols-3">
        <article class="rounded-xl border border-white/10 bg-white/5 p-4 text-base leading-relaxed text-slate-300">
          <h4 class="text-xl font-bold text-slate-100">{{ t('teForm.rules.group1.title') }}</h4>
          <p class="mt-3 text-xs font-bold uppercase tracking-wide text-sky-200">{{ t('teForm.ruleLabel') }}</p>
          <p class="font-semibold text-slate-100">{{ t('teForm.rules.nai.group1Description') }}</p>
          <p class="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.examplesLabel') }}</p>
          <div class="mt-2 space-y-1 font-semibold text-slate-100">
            <p>かきます -> かかない</p>
            <p>いそぎます -> いそがない</p>
            <p>のみます -> のまない</p>
            <p>とります -> とらない</p>
            <p>あそびます -> あそばない</p>
            <p>まちます -> またない</p>
            <p>はなします -> はなさない</p>
          </div>
          <p class="mt-4 text-xs font-bold uppercase tracking-wide text-amber-200">{{ t('teForm.attentionLabel') }}</p>
          <p class="font-semibold text-slate-100">{{ t('teForm.rules.nai.group1IException') }}</p>
          <p class="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.examplesLabel') }}</p>
          <div class="mt-1 space-y-1 font-semibold text-slate-100">
            <p>かいます -> かわない</p>
            <p>はらいます -> はらわない</p>
          </div>
        </article>

        <article class="rounded-xl border border-white/10 bg-white/5 p-4 text-base leading-relaxed text-slate-300">
          <h4 class="text-xl font-bold text-slate-100">{{ t('teForm.rules.group2.title') }}</h4>
          <p class="mt-3 text-xs font-bold uppercase tracking-wide text-sky-200">{{ t('teForm.ruleLabel') }}</p>
          <p class="font-semibold text-slate-100">{{ t('teForm.rules.nai.group2Description') }}</p>
          <p class="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.examplesLabel') }}</p>
          <div class="mt-2 space-y-1 font-semibold text-slate-100">
            <p>たべます -> たべない</p>
            <p>みます -> みない</p>
            <p>おきます -> おきない</p>
            <p>でかけます -> でかけない</p>
            <p>わすれます -> わすれない</p>
          </div>
        </article>

        <article class="rounded-xl border border-white/10 bg-white/5 p-4 text-base leading-relaxed text-slate-300">
          <h4 class="text-xl font-bold text-slate-100">{{ t('teForm.rules.group3.title') }}</h4>
          <p class="mt-3 text-xs font-bold uppercase tracking-wide text-sky-200">{{ t('teForm.ruleLabel') }}</p>
          <p class="font-semibold text-slate-100">{{ t('teForm.rules.nai.group3Irregular') }}</p>
          <p class="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.examplesLabel') }}</p>
          <div class="mt-1 space-y-1 font-semibold text-slate-100">
            <p>します -> しない</p>
            <p>きます -> こない</p>
          </div>
          <p class="mt-4 text-xs font-bold uppercase tracking-wide text-sky-200">{{ t('teForm.ruleLabel') }}</p>
          <p class="font-semibold text-slate-100">{{ t('teForm.rules.nai.group3SuruCompound') }}</p>
          <p class="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.examplesLabel') }}</p>
          <div class="mt-1 space-y-1 font-semibold text-slate-100">
            <p>べんきょうします -> べんきょうしない</p>
            <p>しんぱいします -> しんぱいしない</p>
            <p>ざんぎょうします -> ざんぎょうしない</p>
            <p>しゅっちょうします -> しゅっちょうしない</p>
          </div>
          <p class="mt-4 text-xs font-bold uppercase tracking-wide text-sky-200">{{ t('teForm.ruleLabel') }}</p>
          <p class="font-semibold text-slate-100">{{ t('teForm.rules.nai.group3KuruCompound') }}</p>
          <p class="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.examplesLabel') }}</p>
          <div class="mt-1 space-y-1 font-semibold text-slate-100">
            <p>もってきます -> もってこない</p>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-5 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <button
        type="button"
        class="flex w-full items-center justify-between gap-3 rounded-lg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
        :aria-expanded="String(usesExpanded)"
        @click="usesExpanded = !usesExpanded"
      >
        <span class="text-2xl font-bold text-slate-100">{{ t(conjugationType === 'nai' ? 'teForm.naiUsesTitle' : 'teForm.teUsesTitle') }}</span>
        <img
          :src="arrowDownIcon"
          alt=""
          class="h-5 w-5 shrink-0 brightness-0 invert transition-transform"
          :class="usesExpanded ? '' : '-rotate-90'"
          aria-hidden="true"
        >
      </button>

      <div v-if="usesExpanded" class="mt-3 grid gap-3 md:grid-cols-2">
        <article
          v-for="use in useCards"
          :key="use.title"
          class="rounded-xl border border-white/10 bg-white/5 p-4 text-base leading-relaxed text-slate-300"
        >
          <h4 class="text-lg font-bold text-slate-100">{{ use.title }}</h4>
          <p class="mt-3 text-xs font-bold uppercase tracking-wide text-sky-200">{{ t('teForm.structureLabel') }}</p>
          <p class="font-semibold text-slate-100 whitespace-pre-line">{{ use.structure }}</p>
          <p class="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.phraseLabel') }}</p>
          <p class="font-semibold text-slate-100 whitespace-pre-line">{{ use.phrase }}</p>
          <p class="mt-3 text-xs font-bold uppercase tracking-wide text-slate-400">{{ t('teForm.meaningLabel') }}</p>
          <p class="whitespace-pre-line">{{ use.meaning }}</p>
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
              <p class="font-semibold leading-relaxed text-slate-100">{{ verb.verb }} -> {{ getDisplayConjugation(verb) }} -> {{ verb.translation }}</p>
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
