<script setup>
import { useI18n } from '../i18n';

defineProps({
  currentPath: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['navigate']);
const { t } = useI18n();
</script>

<template>
  <section class="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-xl">
    <div class="inline-flex rounded-xl border border-white/10 bg-slate-950/50 p-1">
      <button
        type="button"
        class="rounded-lg px-4 py-2 text-sm font-semibold"
        :class="currentPath !== '/counting' ? 'bg-slate-100 text-slate-900' : 'text-slate-300'"
        @click="emit('navigate', '/')"
      >
        {{ t('app.kanjiPractice') }}
      </button>
      <button
        type="button"
        class="rounded-lg px-4 py-2 text-sm font-semibold"
        :class="currentPath === '/counting' ? 'bg-slate-100 text-slate-900' : 'text-slate-300'"
        @click="emit('navigate', '/counting')"
      >
        {{ t('app.countingPractice') }}
      </button>
    </div>
  </section>
</template>
