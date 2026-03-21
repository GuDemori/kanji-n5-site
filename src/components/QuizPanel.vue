<script setup>
const props = defineProps({
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
  quizOptions: {
    type: Array,
    required: true,
  },
  quizAnswered: {
    type: Boolean,
    required: true,
  },
  quizFeedback: {
    type: String,
    required: true,
  },
  selectedOption: {
    type: String,
    required: true,
  },
  correctMeaning: {
    type: String,
    default: "",
  },
  shuffleEnabled: {
    type: Boolean,
    required: true,
  },
  transitionDirection: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["answer", "show-hint", "next", "set-shuffle"]);

function optionClasses(option) {
  if (!props.quizAnswered) {
    return "quiz-option border-slate-700 bg-slate-800/70 hover:bg-slate-700/70";
  }

  const isCorrect = option === props.correctMeaning;
  const isWrongSelected = option === props.selectedOption && !isCorrect;

  if (isCorrect) {
    return "quiz-option border-emerald-400/70 bg-emerald-500/20";
  }

  if (isWrongSelected) {
    return "quiz-option border-rose-400/70 bg-rose-500/20";
  }

  return "quiz-option border-slate-700 bg-slate-800/50";
}
</script>

<template>
  <section class="mb-5 rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm">
      <div class="flex flex-wrap gap-2">
        <span class="rounded-full bg-sky-400/15 px-3 py-1 text-sky-200">{{ cardPosition }}</span>
        <span class="rounded-full bg-white/10 px-3 py-1 text-slate-300">{{ sourceLabel }}</span>
      </div>

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
    </div>

    <p class="text-slate-400">Qual é o significado deste kanji?</p>
    <p class="mt-1 text-xs text-sky-200">Atalhos: 1-4 responde, Enter vai para a próxima, Esc fecha dicas.</p>

    <Transition :name="transitionDirection < 0 ? 'card-roulette-up' : 'card-roulette-down'" mode="out-in">
      <div :key="currentKanji" class="kanji-panel mb-4 mt-3 rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5">
        <span class="kanji-face">{{ currentKanji }}</span>
      </div>
    </Transition>

    <div class="grid gap-2 sm:grid-cols-2">
      <button
        v-for="(option, index) in quizOptions"
        :key="`${option}-${index}`"
        type="button"
        :disabled="quizAnswered"
        :class="optionClasses(option)"
        :data-key="index + 1"
        @click="emit('answer', option)"
      >
        {{ option }}
      </button>
    </div>

    <div v-if="quizFeedback" class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
      {{ quizFeedback }}
    </div>

    <div class="mt-4 grid grid-cols-2 gap-2">
      <button type="button" class="action-ghost" @click="emit('show-hint')">Mostrar dica</button>
      <button type="button" class="action-main" :disabled="!quizAnswered" @click="emit('next')">Próxima pergunta</button>
    </div>
  </section>
</template>
