<script setup>
defineProps({
  isFlashcard: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['set-mode', 'reset-progress']);
</script>

<template>
  <section class="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-xl">
    <div class="inline-flex rounded-xl border border-white/10 bg-slate-950/50 p-1">
      <button
        type="button"
        class="rounded-lg px-4 py-2 text-sm font-semibold"
        :class="isFlashcard ? 'bg-slate-100 text-slate-900' : 'text-slate-300'"
        @click="emit('set-mode', 'flashcard')"
      >
        Flashcards
      </button>
      <button
        type="button"
        class="rounded-lg px-4 py-2 text-sm font-semibold"
        :class="!isFlashcard ? 'bg-slate-100 text-slate-900' : 'text-slate-300'"
        @click="emit('set-mode', 'quiz')"
      >
        Quiz
      </button>
    </div>

    <button
      type="button"
      class="ml-auto rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
      @click="emit('reset-progress')"
    >
      Zerar progresso
    </button>
  </section>
</template>
