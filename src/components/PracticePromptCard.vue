<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    required: true,
  },
  meta: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'default',
  },
});

const valueClass = computed(() => {
  if (props.variant === 'compact') return 'text-3xl md:text-4xl';
  if (props.variant === 'kanji') return 'text-7xl md:text-8xl';
  return 'text-5xl';
});
</script>

<template>
  <div class="mb-3 flex h-[170px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-8 text-center">
    <p v-if="label" class="text-xs uppercase tracking-wide text-slate-400">{{ label }}</p>
    <p
      class="mt-2 break-words font-bold leading-none text-slate-50"
      :class="valueClass"
    >
      {{ value }}
    </p>
    <p v-if="meta" class="mt-3 text-sm text-sky-200">{{ meta }}</p>
  </div>
</template>
