<script setup>
import { useI18n } from '../i18n';

defineProps({
  isFlashcard: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['set-mode', 'reset-progress']);
const { locale, setLocale, supportedLocales, t } = useI18n();
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
        {{ t('app.flashcards') }}
      </button>
      <button
        type="button"
        class="rounded-lg px-4 py-2 text-sm font-semibold"
        :class="!isFlashcard ? 'bg-slate-100 text-slate-900' : 'text-slate-300'"
        @click="emit('set-mode', 'quiz')"
      >
        {{ t('app.quiz') }}
      </button>
    </div>

    <label class="text-sm text-slate-300">
      {{ t('app.language') }}
      <select
        :value="locale"
        class="ml-2 rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100"
        @change="setLocale($event.target.value)"
      >
        <option v-for="item in supportedLocales" :key="item.code" :value="item.code">{{ item.label }}</option>
      </select>
    </label>

    <button
      type="button"
      class="ml-auto rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
      @click="emit('reset-progress')"
    >
      {{ t('app.resetProgress') }}
    </button>
  </section>
</template>
