<script setup>
import tradeIcon from '../trade.svg';

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
          <span class="font-semibold">Embaralhar</span>
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
          <span class="font-semibold">Treino completo</span>
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
      <div :key="currentKanji" class="kanji-panel mb-4 rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5">
        <span class="kanji-face">{{ currentKanji }}</span>
      </div>
    </Transition>

    <div class="grid gap-3 lg:grid-cols-3">
      <div class="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col">
        <p class="mb-2 text-xs uppercase tracking-wide text-slate-400">Revelar</p>
        <div class="grid flex-1 grid-rows-2 gap-2">
          <button type="button" class="action-ghost h-full" @click="emit('show-hint')">Mostrar dica</button>
          <button type="button" class="action-main h-full" @click="emit('show-answer')">Revelar resposta</button>
        </div>
      </div>

      <div class="rounded-xl border border-white/10 bg-white/5 p-3">
        <p class="mb-2 text-xs uppercase tracking-wide text-slate-400">Leitura</p>
        <div class="grid gap-2">
          <div class="relative">
            <input
              type="text"
              :value="readingInput"
              :placeholder="readingInputScript === 'katakana' ? 'Digite em romaji ou katakana' : 'Digite em romaji ou hiragana'"
              lang="ja"
              class="w-full rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 pr-11 text-slate-100"
              @input="emit('update-reading', $event.target.value)"
              @keyup.enter="emit('submit-reading')"
            >
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
              :title="readingInputScript === 'katakana' ? 'Trocar conversão automática para hiragana' : 'Trocar conversão automática para katakana'"
              :aria-label="readingInputScript === 'katakana' ? 'Trocar conversão automática para hiragana' : 'Trocar conversão automática para katakana'"
              @click="emit('set-reading-input-script', readingInputScript === 'katakana' ? 'hiragana' : 'katakana')"
            >
              <img :src="tradeIcon" alt="" class="h-4 w-4 brightness-0 invert opacity-95">
            </button>
          </div>
          <button type="button" class="action-main" @click="emit('submit-reading')">Verificar leitura</button>
        </div>
      </div>

      <div class="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col">
        <p class="mb-2 text-xs uppercase tracking-wide text-slate-400">Navegação</p>
        <div class="grid flex-1 grid-rows-2 gap-2">
          <button type="button" class="action-ghost h-full" @click="emit('move-prev')">Anterior</button>
          <button type="button" class="action-main h-full" @click="emit('move-next')">Próximo</button>
        </div>
      </div>
    </div>

    <div v-if="requireAllReadings" class="mt-4 rounded-xl border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-sm text-sky-100">
      Treino completo ativo: {{ readingsFoundCount }}/{{ readingsTotalCount }}
      leituras {{ readingInputScript === 'katakana' ? 'on (katakana)' : 'kun (hiragana)' }} registradas.
      Total deste kanji (leituras kun + on): {{ readingsOverallFoundCount }}/{{ readingsOverallCount }}.
    </div>

    <div v-if="readingFeedback" class="mt-4 whitespace-pre-line rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
      {{ readingFeedback }}
    </div>

    <div v-if="flashcardHint" class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
      {{ flashcardHint }}
    </div>

    <div v-if="flashcardAnswer" class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
      <strong class="block text-lg">{{ flashcardAnswer.title }}</strong>
      <p class="mt-2">Leituras aceitas: {{ flashcardAnswer.reading }}</p>
      <p class="mt-1">{{ flashcardAnswer.source }}</p>
    </div>
  </section>
</template>
