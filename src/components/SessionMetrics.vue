<script setup>
import { useI18n } from '../i18n';

defineProps({
  sessionStats: {
    type: Object,
    required: true,
  },
  sessionRate: {
    type: Number,
    required: true,
  },
});

const { t } = useI18n();
</script>

<template>
  <section class="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-xl sm:grid-cols-5">
    <div class="rounded-xl border border-white/10 bg-white/5 p-3">
      <span class="text-xs uppercase tracking-wide text-slate-400">{{ t('metrics.attempts') }}</span>
      <strong class="mt-1 block text-xl">{{ sessionStats.attempts }}</strong>
    </div>
    <div class="rounded-xl border border-white/10 bg-white/5 p-3">
      <span class="text-xs uppercase tracking-wide text-slate-400">{{ t('metrics.correct') }}</span>
      <strong class="mt-1 block text-xl">{{ sessionStats.correct }}</strong>
    </div>
    <div class="rounded-xl border border-white/10 bg-white/5 p-3">
      <span class="text-xs uppercase tracking-wide text-slate-400">{{ t('metrics.rate') }}</span>
      <strong class="mt-1 block text-xl">{{ sessionRate }}%</strong>
    </div>
    <div class="rounded-xl border border-white/10 bg-white/5 p-3">
      <span class="text-xs uppercase tracking-wide text-slate-400">{{ t('metrics.streak') }}</span>
      <strong class="mt-1 block text-xl">{{ sessionStats.streak }}</strong>
    </div>
    <div class="rounded-xl border border-white/10 bg-white/5 p-3">
      <span class="text-xs uppercase tracking-wide text-slate-400">{{ t('metrics.bestStreak') }}</span>
      <strong class="mt-1 block text-xl">{{ sessionStats.bestStreak }}</strong>
    </div>
  </section>
</template>
