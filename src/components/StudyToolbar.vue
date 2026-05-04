<script setup>
import { computed } from 'vue';
import BaseSelect from './BaseSelect.vue';
import { useI18n } from '../i18n';

defineProps({
  isFlashcard: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['set-mode', 'reset-progress']);
const { locale, setLocale, supportedLocales, t } = useI18n();

const localeOptions = computed(() => supportedLocales.map(item => ({
  value: item.code,
  label: item.label,
})));
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

    <BaseSelect
      :model-value="locale"
      :label="t('app.language')"
      :options="localeOptions"
      wrapper-class="flex items-center gap-2 text-sm text-slate-300"
      button-class="w-36 text-sm"
      @update:model-value="setLocale"
    />

    <button
      type="button"
      class="ml-auto rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
      @click="emit('reset-progress')"
    >
      {{ t('app.resetProgress') }}
    </button>
  </section>
</template>
